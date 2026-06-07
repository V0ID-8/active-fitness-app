import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../constants';

type Props = {
  title: string;
  right?: React.ReactNode;
};

export default function AppHeader({ title, right }: Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {right && <View>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 30,
    color: Colors.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});