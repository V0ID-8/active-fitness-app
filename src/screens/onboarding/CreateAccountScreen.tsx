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
import { MailIcon, LockIcon, EyeIcon } from '../../components/Icon';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateAccount'>;
};

export default function CreateAccountScreen({ navigation }: Props) {
  const [showPassword, setShowPassword] = useState(false);

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
        </ScrollView>

        <View style={styles.footer}>
          <GradientButton
            label="Continue"
            onPress={() => navigation.navigate('Gender')}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  body: {
    flex: 1,
    paddingHorizontal: Spacing.screenHorizontalOnboarding,
    paddingTop: 8,
  },
  scroll: {
    paddingBottom: 12,
  },
  footer: {
    paddingBottom: 20,
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
});