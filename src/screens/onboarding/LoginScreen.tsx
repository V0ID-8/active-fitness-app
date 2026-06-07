import { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { Colors, Fonts, FontSizes, Spacing, Gradients } from '../../constants';
import GradientButton from '../../components/GradientButton';
import { MailIcon, LockIcon, EyeIcon } from '../../components/Icon';
import { authService, getAuthErrorMessage } from '../../services/authService';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authService.signIn(email.trim(), password);
      // useAuth in App.tsx detects the state change and switches to MainNavigator
    } catch (e: any) {
      setError(getAuthErrorMessage(e.code));
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={Gradients.splash.colors}
      start={Gradients.splash.start}
      end={Gradients.splash.end}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.body}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Back */}
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.headline}>Welcome{'\n'}back.</Text>
            <Text style={styles.sub}>Sign in to continue your journey.</Text>

            {/* Email */}
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.fieldBox}>
              <MailIcon color="rgba(255,255,255,0.6)" />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="you@example.com"
                placeholderTextColor="rgba(255,255,255,0.35)"
              />
            </View>

            {/* Password */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Password</Text>
            <View style={styles.fieldBox}>
              <LockIcon color="rgba(255,255,255,0.6)" />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="Your password"
                placeholderTextColor="rgba(255,255,255,0.35)"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <EyeIcon color={showPassword ? Colors.white : 'rgba(255,255,255,0.5)'} />
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.footer}>
            {loading ? (
              <ActivityIndicator color={Colors.white} size="large" />
            ) : (
              <GradientButton label="Log in" onPress={handleLogin} />
            )}
            <Text style={styles.signupLine}>
              Don't have an account?{' '}
              <Text style={styles.signupLink} onPress={() => navigation.navigate('CreateAccount')}>
                Sign up
              </Text>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: Spacing.screenHorizontalOnboarding,
    paddingTop: 8,
  },
  back: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  backText: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    color: 'rgba(255,255,255,0.75)',
  },
  content: {
    flex: 1,
    paddingTop: 24,
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
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 32,
  },
  fieldLabel: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: 'rgba(255,255,255,0.75)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Spacing.inputRadius,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  input: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    color: Colors.white,
  },
  errorText: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: '#FF6B6B',
    marginTop: 14,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: 12,
    gap: 16,
    alignItems: 'center',
  },
  signupLine: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    color: 'rgba(255,255,255,0.75)',
  },
  signupLink: {
    fontWeight: '700',
    color: Colors.white,
  },
});
