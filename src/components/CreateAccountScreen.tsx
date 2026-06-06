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
import { MailIcon, LockIcon, EyeIcon, AppleIcon, GoogleIcon } from '../../components/Icon';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateAccount'>;
};

export default function CreateAccountScreen({ navigation }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TopNav step={1} onBack={() => navigation.goBack()} />

          <Text style={styles.headline}>Create{'\n'}your account</Text>
          <Text style={styles.sub}>Start your fitness journey with Active.</Text>

          {/* Email */}
          <Text style={styles.fieldLabel}>Email</Text>
          <View style={styles.fieldBox}>
            <MailIcon color={Colors.textSecondary} />
            <TextInput
              style={styles.input}
              defaultValue="alex@active.fit"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>

          {/* Password */}
          <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Password</Text>
          <View style={styles.fieldBox}>
            <LockIcon color={Colors.textSecondary} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              secureTextEntry={!showPassword}
              defaultValue="password"
              placeholderTextColor={Colors.textTertiary}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <EyeIcon color={showPassword ? Colors.white : Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={[styles.socialBtn, styles.socialDark]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Gender')}
            >
              <AppleIcon color={Colors.white} />
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialBtn, styles.socialGhost]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Gender')}
            >
              <GoogleIcon />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
          </View>

          <GradientButton
            label="Continue"
            onPress={() => navigation.navigate('Gender')}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: Spacing.screenHorizontalOnboarding,
    paddingTop: 8,
    paddingBottom: 32,
  },
  headline: {
    fontFamily: Fonts.display,
    fontSize: FontSizes.onboardingHeadline,
    color: Colors.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  sub: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  fieldLabel: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.inputRadius,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  input: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    color: Colors.white,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: Colors.textSecondary,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: Spacing.buttonRadius,
  },
  socialDark: {
    backgroundColor: '#1A1A1A',
  },
  socialGhost: {
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  socialText: {
    fontFamily: Fonts.body,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white,
  },
});