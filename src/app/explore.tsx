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
const COLUMN_WIDTH = (width - Spacing.four * 2 - Spacing.three) / 2;

interface PostItem {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  author: string;
  avatarUrl: string;
  likes: number;
  height: number;
}

const CATEGORIES = ['Trending', 'Cafes', 'Nature', 'Hidden Gems', 'Budget Trips'];

const POSTS: PostItem[] = [
  {
    id: '1',
    title: 'Secret rooftop cafe in Shibuya you can’t miss ☕️',
    location: 'Tokyo, Japan',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
    author: 'Elena K.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    likes: 1240,
    height: 230,
  },
  {
    id: '2',
    title: 'Autumn in Kyoto. Morning walk before the crowds arrive.',
    location: 'Kyoto, Japan',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80',
    author: 'Kenji',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    likes: 852,
    height: 180,
  },
  {
    id: '3',
    title: '3-Day itinerary in Mount Fuji with public transit only 🗻',
    location: 'Mount Fuji, Japan',
    imageUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=600&auto=format&fit=crop&q=80',
    author: 'Sarah M.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    likes: 2130,
    height: 210,
  },
  {
    id: '4',
    title: 'Street food night market guide on a tight budget 🍜',
    location: 'Osaka, Japan',
    imageUrl: 'https://images.unsplash.com/photo-1590559899731-a372a14656b0?w=600&auto=format&fit=crop&q=80',
    author: 'Marcus',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    likes: 645,
    height: 250,
  },
];

export default function ExploreScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Trending');

  const leftColumn = POSTS.filter((_, idx) => idx % 2 === 0);
  const rightColumn = POSTS.filter((_, idx) => idx % 2 !== 0);

  const renderCard = (post: PostItem) => (
    <TouchableOpacity key={post.id} activeOpacity={0.9} style={styles.card}>
      <Image
        source={{ uri: post.imageUrl }}
        style={[styles.postImage, { height: post.height }]}
        resizeMode="cover"
      />
      <View style={styles.cardInfo}>
        <Text style={styles.location}>{post.location}</Text>
        <Text style={styles.postTitle} numberOfLines={2}>
          {post.title}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.authorRow}>
            <Image source={{ uri: post.avatarUrl }} style={styles.avatar} />
            <Text style={styles.authorName} numberOfLines={1}>
              {post.author}
            </Text>
          </View>
          <View style={styles.likesRow}>
            <Ionicons name="heart-outline" size={13} color={Colors.light.textSecondary} />
            <Text style={styles.likesCount}>{post.likes}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={20} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      {/* Horizontal Category Pill Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryPill,
                isActive ? styles.categoryPillActive : styles.categoryPillInactive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  isActive ? styles.categoryTextActive : styles.categoryTextInactive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Two-Column Masonry / Red Note Feed */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedScroll}
      >
        <View style={styles.gridRow}>
          <View style={styles.column}>{leftColumn.map(renderCard)}</View>
          <View style={styles.column}>{rightColumn.map(renderCard)}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  searchButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.light.backgroundElement,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryScroll: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  categoryPill: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: Radius.pill,
  },
  categoryPillActive: {
    backgroundColor: Colors.light.backgroundSelected,
  },
  categoryPillInactive: {
    backgroundColor: Colors.light.backgroundElement,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: Colors.light.textInverse,
  },
  categoryTextInactive: {
    color: Colors.light.textSecondary,
  },
  feedScroll: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: 120, // Clears the floating bottom tab bar
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: COLUMN_WIDTH,
    gap: Spacing.three,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: Radius.card,
    borderWidth: Border.hairline,
    borderColor: Colors.light.border,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    backgroundColor: Colors.light.backgroundElement,
  },
  cardInfo: {
    padding: Spacing.two + 2,
    gap: Spacing.one,
  },
  location: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  postTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
    marginRight: 6,
  },
  avatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  authorName: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  likesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  likesCount: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
});