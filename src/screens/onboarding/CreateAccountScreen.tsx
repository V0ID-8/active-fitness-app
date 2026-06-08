import { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput,
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { Colors, Fonts, FontSizes, Spacing } from '../../constants';
import TopNav from '../../components/TopNav';
import GradientButton from '../../components/GradientButton';
import { MailIcon, LockIcon, EyeIcon, UserIcon } from '../../components/Icon';
import { onboardingStore } from '../../utils/onboardingStore';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateAccount'>;
};

export default function CreateAccountScreen({ navigation }: Props) {
  const [name,            setName]            = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [error,           setError]           = useState('');

  function handleContinue() {
    const trimName  = name.trim();
    const trimEmail = email.trim();

    if (!trimName) {
      setError('Please enter your full name.'); return;
    }
    if (!trimEmail || !trimEmail.includes('@')) {
      setError('Please enter a valid email address.'); return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.'); return;
    }

    onboardingStore.displayName = trimName;
    onboardingStore.email       = trimEmail;
    onboardingStore.password    = password;

    setError('');
    navigation.navigate('Gender');
  }

  const clearError = () => setError('');

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TopNav step={1} onBack={() => navigation.goBack()} />

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.headline}>Create{'\n'}your account</Text>
          <Text style={styles.sub}>Start your fitness journey with Active.</Text>

          {/* Full Name */}
          <Text style={styles.fieldLabel}>Full Name</Text>
          <View style={styles.fieldBox}>
            <UserIcon size={20} color={Colors.textSecondary} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={name}
              onChangeText={(v) => { setName(v); clearError(); }}
              autoCapitalize="words"
              autoCorrect={false}
              placeholder="John Smith"
              placeholderTextColor={Colors.textTertiary}
              returnKeyType="next"
            />
          </View>

          {/* Email */}
          <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Email</Text>
          <View style={styles.fieldBox}>
            <MailIcon color={Colors.textSecondary} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={email}
              onChangeText={(v) => { setEmail(v); clearError(); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="you@example.com"
              placeholderTextColor={Colors.textTertiary}
              returnKeyType="next"
            />
          </View>

          {/* Password */}
          <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Password</Text>
          <View style={styles.fieldBox}>
            <LockIcon color={Colors.textSecondary} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={password}
              onChangeText={(v) => { setPassword(v); clearError(); }}
              secureTextEntry={!showPassword}
              placeholder="Min. 6 characters"
              placeholderTextColor={Colors.textTertiary}
              returnKeyType="next"
            />
            <TouchableOpacity
              onPress={() => setShowPassword((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <EyeIcon color={showPassword ? Colors.white : Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Confirm Password</Text>
          <View style={[
            styles.fieldBox,
            confirmPassword.length > 0 && password !== confirmPassword && styles.fieldBoxError,
          ]}>
            <LockIcon color={Colors.textSecondary} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={confirmPassword}
              onChangeText={(v) => { setConfirmPassword(v); clearError(); }}
              secureTextEntry={!showConfirm}
              placeholder="Re-enter your password"
              placeholderTextColor={Colors.textTertiary}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />
            <TouchableOpacity
              onPress={() => setShowConfirm((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <EyeIcon color={showConfirm ? Colors.white : Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </ScrollView>

        <View style={styles.footer}>
          <GradientButton label="Continue" onPress={handleContinue} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.background },
  body:   { flex: 1, paddingHorizontal: Spacing.screenHorizontalOnboarding, paddingTop: 8 },
  scroll: { paddingBottom: 12 },
  footer: { paddingBottom: 20, paddingTop: 24 },
  headline: {
    fontFamily: Fonts.display, fontSize: FontSizes.onboardingHeadline,
    color: Colors.white, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10,
  },
  sub: {
    fontFamily: Fonts.body, fontSize: FontSizes.body,
    color: Colors.textSecondary, marginBottom: 32,
  },
  fieldLabel: {
    fontFamily: Fonts.body, fontSize: FontSizes.label,
    color: Colors.textSecondary, textTransform: 'uppercase',
    letterSpacing: 0.8, marginBottom: 8,
  },
  fieldBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: Spacing.inputRadius,
    paddingHorizontal: 16, paddingVertical: 14, gap: 12,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  fieldBoxError: { borderColor: Colors.danger },
  input: { fontFamily: Fonts.body, fontSize: FontSizes.body, color: Colors.white },
  errorText: {
    fontFamily: Fonts.body, fontSize: FontSizes.label,
    color: Colors.danger, marginTop: 14,
  },
});
