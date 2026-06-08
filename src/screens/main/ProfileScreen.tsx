import { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  Modal, TextInput, ActivityIndicator, KeyboardAvoidingView,
  Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, FontSizes, Spacing, Gradients } from '../../constants';
import { UserIcon, ChevronRightIcon } from '../../components/Icon';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import { calculateFullProfile } from '../../utils/calculations';
import { Goal, ActivityLevel } from '../../types';

// ─── Display label maps ───────────────────────────────────────────────────────
const GOAL_LABELS: Record<Goal, string> = {
  lose: 'Lose Weight',
  gain: 'Build Muscle',
  fit:  'Stay Fit',
};
const GOAL_COLORS: Record<Goal, string> = {
  lose: Colors.pink,
  gain: Colors.purple,
  fit:  Colors.green,
};
const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary',
  light:     'Light',
  moderate:  'Moderate',
  active:    'Active',
};

export default function ProfileScreen() {
  const { user }        = useAuth();
  const { profile }     = useUserProfile(user?.uid ?? null);

  // Edit modal state
  const [modalVisible,  setModalVisible]  = useState(false);
  const [editWeight,    setEditWeight]    = useState('');
  const [editGoal,      setEditGoal]      = useState<Goal>('fit');
  const [editActivity,  setEditActivity]  = useState<ActivityLevel>('moderate');
  const [saving,        setSaving]        = useState(false);

  const openModal = () => {
    if (!profile) return;
    setEditWeight(String(profile.weightKg));
    setEditGoal(profile.goal);
    setEditActivity(profile.activityLevel);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!user || !profile || saving) return;
    const kg = parseFloat(editWeight.replace(',', '.'));
    if (isNaN(kg) || kg < 20 || kg > 300) return;
    setSaving(true);
    const calc = calculateFullProfile(
      profile.gender, kg, profile.heightCm, profile.age, editActivity, editGoal,
    );
    await userService.updateUserProfile(user.uid, {
      weightKg:     kg,
      goal:         editGoal,
      activityLevel: editActivity,
      ...calc,
    });
    setSaving(false);
    setModalVisible(false);
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => authService.signOut() },
    ]);
  };

  const initial = profile?.displayName?.[0]?.toUpperCase() ?? '?';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header card */}
        <LinearGradient
          colors={Gradients.primary.colors}
          start={Gradients.primary.start}
          end={Gradients.primary.end}
          style={styles.headerCard}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{initial}</Text>
          </View>
          <Text style={styles.name}>{profile?.displayName ?? '—'}</Text>
          <Text style={styles.email}>{profile?.email ?? '—'}</Text>
          {profile && (
            <View style={[styles.goalBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Text style={styles.goalBadgeText}>{GOAL_LABELS[profile.goal]}</Text>
            </View>
          )}
        </LinearGradient>

        {/* Body stats */}
        <View style={styles.statsCard}>
          {[
            { label: 'Weight',  value: profile ? `${profile.weightKg} kg` : '—' },
            { label: 'Height',  value: profile ? `${profile.heightCm} cm` : '—' },
            { label: 'Age',     value: profile ? `${profile.age} yr`      : '—' },
          ].map((s, i, arr) => (
            <View key={s.label} style={[styles.statCell, i < arr.length - 1 && styles.statCellDivider]}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Goals / nutrition targets */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nutrition targets</Text>
          {[
            { label: 'Calorie goal',    value: profile ? `${profile.calorieGoal.toLocaleString()} kcal` : '—' },
            { label: 'Protein goal',    value: profile ? `${profile.proteinGoalG} g`                    : '—' },
            { label: 'Carbs goal',      value: profile ? `${profile.carbGoalG} g`                       : '—' },
            { label: 'Fat goal',        value: profile ? `${profile.fatGoalG} g`                        : '—' },
          ].map((row, i, arr) => (
            <View key={row.label} style={[styles.infoRow, i < arr.length - 1 && styles.infoRowDivider]}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Profile settings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Settings</Text>
          <View style={[styles.infoRow, styles.infoRowDivider]}>
            <Text style={styles.infoLabel}>Goal</Text>
            {profile && (
              <View style={[styles.chip, { backgroundColor: GOAL_COLORS[profile.goal] + '22' }]}>
                <Text style={[styles.chipText, { color: GOAL_COLORS[profile.goal] }]}>
                  {GOAL_LABELS[profile.goal]}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Activity level</Text>
            <Text style={styles.infoValue}>
              {profile ? ACTIVITY_LABELS[profile.activityLevel] : '—'}
            </Text>
          </View>
        </View>

        {/* Edit button */}
        <TouchableOpacity style={styles.editBtn} activeOpacity={0.85} onPress={openModal}>
          <UserIcon size={18} color={Colors.white} />
          <Text style={styles.editBtnText}>Edit Profile</Text>
          <ChevronRightIcon size={16} color={Colors.white} />
        </TouchableOpacity>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.8} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Active v1.0.0</Text>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <ScrollView style={styles.modalSheet} contentContainerStyle={styles.modalContent} bounces={false}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Edit Profile</Text>

            {/* Weight */}
            <Text style={styles.fieldLabel}>Current weight (kg)</Text>
            <TextInput
              style={styles.weightInput}
              value={editWeight}
              onChangeText={setEditWeight}
              keyboardType="decimal-pad"
              placeholder="e.g. 72.5"
              placeholderTextColor={Colors.textTertiary}
            />

            {/* Goal */}
            <Text style={styles.fieldLabel}>Goal</Text>
            <View style={styles.chipRow}>
              {(['lose', 'gain', 'fit'] as Goal[]).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.selectChip, editGoal === g && styles.selectChipActive]}
                  onPress={() => setEditGoal(g)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.selectChipText, editGoal === g && styles.selectChipTextActive]}>
                    {GOAL_LABELS[g]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Activity Level */}
            <Text style={styles.fieldLabel}>Activity level</Text>
            <View style={styles.chipRow}>
              {(['sedentary', 'light', 'moderate', 'active'] as ActivityLevel[]).map((a) => (
                <TouchableOpacity
                  key={a}
                  style={[styles.selectChip, editActivity === a && styles.selectChipActive]}
                  onPress={() => setEditActivity(a)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.selectChipText, editActivity === a && styles.selectChipTextActive]}>
                    {ACTIVITY_LABELS[a]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.recalcNote}>
              Saving will recalculate your calorie and macro targets.
            </Text>

            {/* Actions */}
            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              activeOpacity={0.85}
              onPress={handleSave}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={styles.saveBtnText}>Save Changes</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.screenHorizontalApp, paddingTop: 24, paddingBottom: Spacing.tabBarOffset },

  // Header card
  headerCard:   { borderRadius: Spacing.cardRadius, padding: 28, alignItems: 'center', gap: 6, marginBottom: 14 },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  avatarLetter: { fontFamily: Fonts.display, fontSize: 32, color: Colors.white },
  name:         { fontFamily: Fonts.body, fontSize: 20, fontWeight: '700', color: Colors.white },
  email:        { fontFamily: Fonts.body, fontSize: FontSizes.label, color: 'rgba(255,255,255,0.75)' },
  goalBadge:    { borderRadius: 99, paddingHorizontal: 14, paddingVertical: 5, marginTop: 4 },
  goalBadgeText:{ fontFamily: Fonts.body, fontSize: 13, fontWeight: '600', color: Colors.white },

  // Body stats
  statsCard:    { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Spacing.cardRadius, marginBottom: 14, overflow: 'hidden' },
  statCell:     { flex: 1, alignItems: 'center', paddingVertical: 18, gap: 4 },
  statCellDivider: { borderRightWidth: 1, borderRightColor: Colors.border },
  statValue:    { fontFamily: Fonts.display, fontSize: 22, color: Colors.white },
  statLabel:    { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textSecondary },

  // Generic card
  card:         { backgroundColor: Colors.surface, borderRadius: Spacing.cardRadius, padding: 18, marginBottom: 14, gap: 2 },
  cardTitle:    { fontFamily: Fonts.body, fontSize: 13, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
  infoRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11 },
  infoRowDivider: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  infoLabel:    { fontFamily: Fonts.body, fontSize: FontSizes.body, color: Colors.textSecondary },
  infoValue:    { fontFamily: Fonts.body, fontSize: FontSizes.body, fontWeight: '600', color: Colors.white },
  chip:         { borderRadius: 99, paddingHorizontal: 12, paddingVertical: 4 },
  chipText:     { fontFamily: Fonts.body, fontSize: 13, fontWeight: '600' },

  // Edit button
  editBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.purple, borderRadius: 14, paddingVertical: 16, marginBottom: 12 },
  editBtnText:  { fontFamily: Fonts.body, fontSize: 15, fontWeight: '700', color: Colors.white, flex: 1, textAlign: 'center', marginLeft: -18 },

  // Sign out
  signOutBtn:   { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: Colors.border },
  signOutText:  { fontFamily: Fonts.body, fontSize: 15, fontWeight: '600', color: Colors.pink },
  version:      { textAlign: 'center', fontFamily: Fonts.body, fontSize: 11, color: Colors.textTertiary },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop:{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  modalSheet:   { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' },
  modalContent: { padding: 24, paddingBottom: 48 },
  modalHandle:  { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 20 },
  modalTitle:   { fontFamily: Fonts.display, fontSize: 22, color: Colors.white, marginBottom: 24 },

  // Modal fields
  fieldLabel:   { fontFamily: Fonts.body, fontSize: 13, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  weightInput:  { backgroundColor: Colors.surfaceRaised, borderRadius: 14, paddingHorizontal: 18, paddingVertical: 14, fontFamily: Fonts.body, fontSize: 22, color: Colors.white, textAlign: 'center', marginBottom: 22 },
  chipRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 },
  selectChip:   { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 99, backgroundColor: Colors.surfaceRaised, borderWidth: 1, borderColor: 'transparent' },
  selectChipActive:    { backgroundColor: Colors.pink + '22', borderColor: Colors.pink },
  selectChipText:      { fontFamily: Fonts.body, fontSize: 14, color: Colors.textSecondary },
  selectChipTextActive:{ color: Colors.pink, fontWeight: '600' },
  recalcNote:   { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textTertiary, textAlign: 'center', marginBottom: 24, lineHeight: 18 },
  saveBtn:      { backgroundColor: Colors.pink, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText:  { fontFamily: Fonts.body, fontSize: 16, fontWeight: '700', color: Colors.white },
  cancelBtn:    { paddingVertical: 12, alignItems: 'center' },
  cancelBtnText:{ fontFamily: Fonts.body, fontSize: FontSizes.body, color: Colors.textSecondary },
});
