import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { Colors, Gradients, Fonts, FontSizes, Spacing } from '../../constants';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export default function SplashScreen({ navigation }: Props) {
  return (
    <LinearGradient
      colors={Gradients.splash.colors}
      start={Gradients.splash.start}
      end={Gradients.splash.end}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        {/* Center: logo + wordmark + tagline */}
        <View style={styles.center}>
          <Image
            source={require('../../../assets/images/av-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.wordmark}>ACTIVE</Text>
          <Text style={styles.tagline}>Train smarter. Live active.</Text>
        </View>

        {/* Bottom: Get Started + Log in */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.btnWhite}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('CreateAccount')}

            
          >
            <Text style={styles.btnWhiteText}>Get Started</Text>
          </TouchableOpacity>

          <Text style={styles.loginLine}>
            Already a member?{' '}
            <Text
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              Log in
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: Spacing.screenHorizontalOnboarding,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 8,
  },
  wordmark: {
    fontFamily: Fonts.display,
    fontSize: 52,
    color: Colors.white,
    letterSpacing: 7,
    marginBottom: 12,
  },
  tagline: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.3,
  },
  footer: {
    paddingBottom: 12,
    gap: 16,
    alignItems: 'center',
  },
  btnWhite: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.buttonRadius,
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnWhiteText: {
    fontFamily: Fonts.body,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.purple,
  },
  loginLine: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    color: 'rgba(255,255,255,0.85)',
  },
  loginLink: {
    fontWeight: '700',
    color: Colors.white,
  },
});