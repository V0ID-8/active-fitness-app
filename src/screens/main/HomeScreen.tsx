import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, FontSizes, Spacing, Gradients } from '../../constants';
import { BellIcon, DumbbellIcon, PlayIcon } from '../../components/Icon';

// Static data — will connect to state later
const BARS = [40, 62, 35, 78, 55, 90, 48];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const ACTIVE_BAR = 5;

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: avatar + greeting + bell */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <View style={styles.greet}>
            <Text style={styles.greetSmall}>Good morning</Text>
            <Text style={styles.greetName}>Alex Carter</Text>
          </View>
          <View style={styles.bellWrap}>
            <BellIcon size={22} color={Colors.white} />
            {/* Notification dot */}
            <View style={styles.bellDot} />
          </View>
        </View>

        {/* Hero card */}
        <LinearGradient
          colors={Gradients.primary.colors}
          start={Gradients.primary.start}
          end={Gradients.primary.end}
          style={styles.hero}
        >
          {/* Large faded dumbbell icon as decoration */}
          <View style={styles.heroDeco} pointerEvents="none">
            <DumbbellIcon size={130} color="rgba(255,255,255,0.12)" />
          </View>

          <Text style={styles.heroEyebrow}>Today · Upper Body</Text>
          <Text style={styles.heroTitle}>No excuses.{'\n'}Just progress.</Text>

          <TouchableOpacity style={styles.heroBtn} activeOpacity={0.85}>
            <PlayIcon size={15} color={Colors.purple} />
            <Text style={styles.heroBtnText}>Start workout</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: Spacing.screenHorizontalApp,
    paddingTop: 16,
    paddingBottom: Spacing.tabBarOffset,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Colors.white,
  },
  greet: {
    flex: 1,
    gap: 1,
  },
  greetSmall: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: Colors.textSecondary,
  },
  greetName: {
    fontFamily: Fonts.body,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  bellWrap: {
    position: 'relative',
    padding: 4,
  },
  bellDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.pink,
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  // Hero card
  hero: {
    borderRadius: Spacing.cardRadius,
    padding: 22,
    marginBottom: Spacing.sectionGap,
    overflow: 'hidden',
    minHeight: 180,
    justifyContent: 'flex-end',
  },
  heroDeco: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  heroEyebrow: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: 'rgba(255,255,255,0.75)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  heroTitle: {
    fontFamily: Fonts.display,
    fontSize: 26,
    color: Colors.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 18,
    lineHeight: 32,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 99,
  },
  heroBtnText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.purple,
  },
});