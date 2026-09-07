import { Border, Colors, Radius, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const POST_WIDTH = (width - Spacing.four * 2 - Spacing.two) / 2;

const STATS = [
  { label: 'Trips', count: '8' },
  { label: 'Countries', count: '5' },
  { label: 'Cities', count: '14' },
  { label: 'Guides', count: '12' },
];

const MY_POSTS = [
  {
    id: '1',
    title: 'Hidden matcha spots in Gion you must visit 🍵',
    likes: 1240,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    title: '48 Hours in Osaka: Night food & Dotonbori',
    likes: 890,
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '3',
    title: 'Fushimi Inari early morning route guide',
    likes: 2150,
    image: 'https://images.unsplash.com/photo-1478436127897-769e00d2c715?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '4',
    title: 'Arashiyama Bamboo Grove photography tips',
    likes: 670,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&auto=format&fit=crop&q=80',
  },
];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'posts' | 'badges'>('posts');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Header Actions */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconCircle}>
              <Ionicons name="share-outline" size={20} color={Colors.light.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCircle}>
              <Ionicons name="settings-outline" size={20} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* User Card */}
        <View style={styles.profileHero}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
            }}
            style={styles.avatar}
          />
          <View style={styles.identity}>
            <Text style={styles.userName}>Traveler</Text>
            <Text style={styles.userHandle}>@journey_notes</Text>
            <Text style={styles.userBio}>
              Exploring Japan cafes, historic shrines & urban architecture ✈️📍
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity activeOpacity={0.85} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={styles.secondaryButton}>
            <Ionicons name="sparkles-outline" size={16} color={Colors.light.text} />
            <Text style={styles.secondaryButtonText}>Travel Stats</Text>
          </TouchableOpacity>
        </View>

        {/* Travel Summary Counter Grid */}
        <View style={styles.statsContainer}>
          {STATS.map((stat, idx) => (
            <View key={idx} style={styles.statItem}>
              <Text style={styles.statCount}>{stat.count}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Segmented Control (Posts vs Badges) */}
        <View style={styles.segmentWrapper}>
          <TouchableOpacity
            onPress={() => setActiveTab('posts')}
            style={[styles.segmentBtn, activeTab === 'posts' && styles.segmentBtnActive]}
          >
            <Ionicons
              name="grid-outline"
              size={17}
              color={activeTab === 'posts' ? Colors.light.text : Colors.light.textTertiary}
            />
            <Text
              style={[
                styles.segmentText,
                activeTab === 'posts' && styles.segmentTextActive,
              ]}
            >
              My Guides
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('badges')}
            style={[styles.segmentBtn, activeTab === 'badges' && styles.segmentBtnActive]}
          >
            <Ionicons
              name="medal-outline"
              size={17}
              color={activeTab === 'badges' ? Colors.light.text : Colors.light.textTertiary}
            />
            <Text
              style={[
                styles.segmentText,
                activeTab === 'badges' && styles.segmentTextActive,
              ]}
            >
              Passport
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'posts' ? (
          <View style={styles.postsGrid}>
            {MY_POSTS.map((post) => (
              <TouchableOpacity key={post.id} activeOpacity={0.85} style={styles.postCard}>
                <Image source={{ uri: post.image }} style={styles.postImage} />
                <View style={styles.postContent}>
                  <Text numberOfLines={2} style={styles.postTitle}>
                    {post.title}
                  </Text>
                  <View style={styles.postFooter}>
                    <View style={styles.likeRow}>
                      <Ionicons name="heart-outline" size={13} color={Colors.light.textTertiary} />
                      <Text style={styles.likeText}>{post.likes}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="airplane-outline" size={40} color={Colors.light.textTertiary} />
            <Text style={styles.emptyTitle}>Country Passport</Text>
            <Text style={styles.emptySubtitle}>
              Log stamps as you complete your itineraries.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingBottom: 120, // Extra clearance for the floating dock
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.light.text,
    letterSpacing: -0.4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.light.backgroundElement,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHero: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    gap: 16,
    marginTop: Spacing.two,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: Border.hairline,
    borderColor: Colors.light.border,
  },
  identity: {
    flex: 1,
  },
  userName: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.light.text,
  },
  userHandle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  userBio: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.light.textSecondary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.four,
  },
  primaryButton: {
    flex: 1,
    height: 38,
    borderRadius: Radius.pill,
    backgroundColor: Colors.light.backgroundSelected,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    height: 38,
    borderRadius: Radius.pill,
    backgroundColor: Colors.light.backgroundElement,
  },
  secondaryButtonText: {
    color: Colors.light.text,
    fontSize: 13,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.four,
    marginTop: Spacing.four,
    paddingVertical: 14,
    backgroundColor: Colors.light.card,
    borderRadius: Radius.card,
    borderWidth: Border.hairline,
    borderColor: Colors.light.border,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statCount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.light.textTertiary,
    marginTop: 2,
  },
  segmentWrapper: {
    flexDirection: 'row',
    marginHorizontal: Spacing.four,
    marginTop: Spacing.four,
    marginBottom: Spacing.three,
    padding: 4,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radius.pill,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },
  segmentBtnActive: {
    backgroundColor: Colors.light.card,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textTertiary,
  },
  segmentTextActive: {
    color: Colors.light.text,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  postCard: {
    width: POST_WIDTH,
    backgroundColor: Colors.light.card,
    borderRadius: Radius.card,
    overflow: 'hidden',
    borderWidth: Border.hairline,
    borderColor: Colors.light.border,
    marginBottom: Spacing.two,
  },
  postImage: {
    width: '100%',
    height: 130,
  },
  postContent: {
    padding: 8,
  },
  postTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
    lineHeight: 16,
  },
  postFooter: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeText: {
    fontSize: 11,
    color: Colors.light.textTertiary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});