import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {RootStackParamList} from '../types/manga';

type Props = NativeStackScreenProps<RootStackParamList, 'Legal'>;

const copy = {
  privacy: {
    header: 'Privacy',
    title: 'Privacy Policy',
    intro:
      'MangaVerse is designed to give readers a personal manga experience while keeping data use clear and limited. This policy explains the information we use to operate the app and improve the reading experience.',
    sections: [
      {
        title: 'Information Used',
        body: 'We may use account information you provide through sign-in, such as your name, email address, and profile image. MangaVerse also stores app preferences, favorites, collection state, theme choices, and reading progress so the app can remember where you left off.',
      },
      {
        title: 'Local Storage',
        body: 'Favorites, reading progress, and personalization settings are stored on your device unless a feature clearly indicates that information is being synced or submitted.',
      },
      {
        title: 'Third Parties',
        body: 'If you sign in with a third-party provider, that provider may process your information under its own privacy policy. MangaVerse does not sell personal information.',
      },
      {
        title: 'Your Choices',
        body: 'You can update preferences in the app, remove local app data from your device settings, or sign out to stop associating local activity with an account on that device.',
      },
      {
        title: 'Contact',
        body: 'Privacy questions can be sent through the support or feedback options provided in the app.',
      },
    ],
  },
  terms: {
    header: 'Terms',
    title: 'Terms of Service',
    intro:
      'Welcome to MangaVerse. By accessing or using the app, you agree to these Terms of Service and to use MangaVerse only for lawful, personal, and non-commercial purposes.',
    sections: [
      {
        title: 'Accounts and Access',
        body: 'You are responsible for the activity associated with your account and for keeping your device and sign-in credentials secure. We may suspend or limit access when needed to protect the service, other users, creators, or rights holders.',
      },
      {
        title: 'Content',
        body: 'MangaVerse provides access to manga, creator profiles, reading tools, recommendations, and related editorial content. All content remains owned by MangaVerse, its licensors, creators, or applicable rights holders. You may not copy, redistribute, scrape, sell, or modify content except where the app expressly allows it.',
      },
      {
        title: 'Acceptable Use',
        body: "Do not interfere with the app, attempt unauthorized access, bypass usage limits, upload harmful material, or use MangaVerse in a way that infringes another person's rights.",
      },
      {
        title: 'Changes and Availability',
        body: 'We may update features, content, pricing, or these terms from time to time. We aim to keep MangaVerse reliable, but we do not guarantee uninterrupted availability.',
      },
      {
        title: 'Contact',
        body: 'Questions about these terms can be sent through the support or feedback options provided in the app.',
      },
    ],
  },
};

export function LegalScreen({navigation, route}: Props): React.JSX.Element {
  const content = copy[route.params.type];

  return (
    <SafeAreaView
      style={styles.screen}
      edges={['top', 'right', 'bottom', 'left']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{content.header}</Text>
        <View style={styles.backButton} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>Legal</Text>
        <Text style={styles.title}>{content.title}</Text>
        <Text style={styles.body}>{content.intro}</Text>
        {content.sections.map(section => (
          <View key={section.title}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.body}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#101010',
  },
  header: {
    alignItems: 'center',
    borderBottomColor: '#242424',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  backButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 56,
  },
  backText: {
    color: '#f6c453',
    fontWeight: '800',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  kicker: {
    color: '#f6c453',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '900',
    marginBottom: 18,
    marginTop: 6,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 18,
  },
  body: {
    color: '#c8c8c8',
    fontSize: 14,
    lineHeight: 22,
  },
});
