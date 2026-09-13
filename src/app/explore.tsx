import { Border, Colors, Radius, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardEvent,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - Spacing.four * 2 - Spacing.three) / 2;

interface ItineraryDaySummary {
  day: number;
  highlight: string;
  placesCount: number;
}

interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timeAgo: string;
}

interface PostItem {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  gallery: string[];
  author: string;
  avatarUrl: string;
  likes: number;
  isLiked?: boolean;
  comments: Comment[];
  height: number;
  daysSummary: ItineraryDaySummary[];
}

const CATEGORIES = ['Trending', 'Cafes', 'Nature', 'Hidden Gems', 'Budget Trips'];

const INITIAL_POSTS: PostItem[] = [
  {
    id: '1',
    title: 'Secret rooftop cafe in Shibuya you can’t miss ☕️',
    location: 'Tokyo, Japan',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    ],
    author: 'Elena K.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    likes: 1240,
    isLiked: false,
    height: 230,
    daysSummary: [
      { day: 1, highlight: 'Shibuya Crossing & Miyashita Rooftop', placesCount: 4 },
      { day: 2, highlight: 'Omotesando Cafe Crawl & Cat Street', placesCount: 5 },
      { day: 3, highlight: 'Shinjuku Gyoen & Omoide Yokocho', placesCount: 3 },
    ],
    comments: [
      {
        id: 'c1',
        user: 'Kenji',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
        text: 'The view at sunset here is unmatched!',
        timeAgo: '2h ago',
      },
      {
        id: 'c2',
        user: 'Marcus',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
        text: 'Adding this to my weekend plan.',
        timeAgo: '4h ago',
      },
    ],
  },
  {
    id: '2',
    title: 'Autumn in Kyoto. Morning walk before the crowds arrive.',
    location: 'Kyoto, Japan',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
    ],
    author: 'Kenji',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    likes: 852,
    isLiked: true,
    height: 180,
    daysSummary: [
      { day: 1, highlight: 'Arashiyama Bamboo & Nishiki Market', placesCount: 3 },
      { day: 2, highlight: 'Fushimi Inari Sunrise & Kiyomizu-dera', placesCount: 4 },
    ],
    comments: [
      {
        id: 'c3',
        user: 'Sarah M.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
        text: 'What time did you get to Arashiyama?',
        timeAgo: '1d ago',
      },
    ],
  },
  {
    id: '3',
    title: '3-Day itinerary in Mount Fuji with public transit only 🗻',
    location: 'Mount Fuji, Japan',
    imageUrl: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578637387939-43c525550085?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&auto=format&fit=crop&q=80',
    ],
    author: 'Sarah M.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    likes: 2130,
    isLiked: false,
    height: 220,
    daysSummary: [
      { day: 1, highlight: 'Lake Kawaguchiko & Ropeway Views', placesCount: 3 },
      { day: 2, highlight: 'Chureito Pagoda & Oshino Hakkai', placesCount: 4 },
      { day: 3, highlight: 'Fuji-Q & Retro Train Departure', placesCount: 2 },
    ],
    comments: [
      {
        id: 'c4',
        user: 'Ivory',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
        text: 'Does the highway bus get crowded on Fridays?',
        timeAgo: '3h ago',
      },
    ],
  },
  {
    id: '4',
    title: 'Street food night market guide on a tight budget 🍜',
    location: 'Osaka, Japan',
    imageUrl: 'https://images.unsplash.com/photo-1576675784201-0e142b423952?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576675784201-0e142b423952?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=800&auto=format&fit=crop&q=80',
    ],
    author: 'Marcus',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    likes: 645,
    isLiked: false,
    height: 240,
    daysSummary: [
      { day: 1, highlight: 'Dotonbori Takoyaki Crawl & Hozenji Yokocho', placesCount: 5 },
      { day: 2, highlight: 'Shinsekai Kushikatsu & Retro Arcade Tour', placesCount: 4 },
    ],
    comments: [
      {
        id: 'c5',
        user: 'Elena K.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
        text: 'The kushikatsu place near the tower is so cheap!',
        timeAgo: '5h ago',
      },
    ],
  },
];

// Carousel card with horizontal swipe support on the feed
function FeedPostCard({
  post,
  onPressCard,
  onToggleLike,
}: {
  post: PostItem;
  onPressCard: () => void;
  onToggleLike: () => void;
}) {
  const [photoIndex, setPhotoIndex] = useState(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(e.nativeEvent.contentOffset.x / COLUMN_WIDTH);
    if (slide !== photoIndex && slide >= 0 && slide < post.gallery.length) {
      setPhotoIndex(slide);
    }
  };

  return (
    <View style={styles.card}>
      {/* Swipeable Photo Carousel */}
      <View style={{ height: post.height, width: '100%', position: 'relative' }}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
        >
          {post.gallery.map((uri, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.95}
              onPress={onPressCard}
              style={{ width: COLUMN_WIDTH, height: post.height }}
            >
              <Image source={{ uri }} style={styles.carouselImg} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Carousel Pagination Dots */}
        {post.gallery.length > 1 && (
          <View style={styles.paginationDotsContainer}>
            {post.gallery.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.paginationDot,
                  photoIndex === idx && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        )}

        {/* Multi-photo badge */}
        {post.gallery.length > 1 && (
          <View style={styles.multiPhotoBadge}>
            <Ionicons name="images" size={10} color="#FFFFFF" />
            <Text style={styles.multiPhotoBadgeText}>
              {photoIndex + 1}/{post.gallery.length}
            </Text>
          </View>
        )}
      </View>

      {/* Card Info Details */}
      <TouchableOpacity activeOpacity={0.88} onPress={onPressCard} style={styles.cardInfo}>
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
          <TouchableOpacity
            style={styles.likesRow}
            onPress={(e) => {
              e.stopPropagation();
              onToggleLike();
            }}
          >
            <Ionicons
              name={post.isLiked ? 'heart' : 'heart-outline'}
              size={14}
              color={post.isLiked ? '#EF4444' : Colors.light.textSecondary}
            />
            <Text style={[styles.likesCount, post.isLiked && styles.likesCountActive]}>
              {post.likes}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function ExploreScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Trending');
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);

  // Inspector & Clone Modal State
  const [activePost, setActivePost] = useState<PostItem | null>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const [commentInput, setCommentInput] = useState('');

  const keyboardHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: KeyboardEvent) => {
      const targetHeight = Platform.OS === 'ios' ? Math.max(e.endCoordinates.height - 24, 0) : 0;
      Animated.timing(keyboardHeight, {
        toValue: targetHeight,
        duration: e.duration || 250,
        useNativeDriver: false,
      }).start();
    };

    const onHide = (e: KeyboardEvent) => {
      Animated.timing(keyboardHeight, {
        toValue: 0,
        duration: e?.duration || 250,
        useNativeDriver: false,
      }).start();
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((item) => {
        if (item.id === postId) {
          const updatedLiked = !item.isLiked;
          return {
            ...item,
            isLiked: updatedLiked,
            likes: updatedLiked ? item.likes + 1 : item.likes - 1,
          };
        }
        return item;
      })
    );

    if (activePost && activePost.id === postId) {
      setActivePost((prev) =>
        prev
          ? {
              ...prev,
              isLiked: !prev.isLiked,
              likes: !prev.isLiked ? prev.likes + 1 : prev.likes - 1,
            }
          : null
      );
    }
  };

  const handleAddComment = () => {
    if (!commentInput.trim() || !activePost) return;

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      user: 'Ivory (You)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      text: commentInput.trim(),
      timeAgo: 'Just now',
    };

    const updatedComments = [...activePost.comments, newComment];

    setPosts((prev) =>
      prev.map((p) => (p.id === activePost.id ? { ...p, comments: updatedComments } : p))
    );

    setActivePost((prev) => (prev ? { ...prev, comments: updatedComments } : null));
    setCommentInput('');
    Keyboard.dismiss();
  };

  const handleCloneItinerary = (post: PostItem) => {
    Alert.alert(
      'Clone Itinerary 🗺️',
      `Copy "${post.title}" into your trip workspace? All scheduled stops, tags, and route pacing will be copied to your planner.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clone to Planner',
          style: 'default',
          onPress: () => {
            setActivePost(null);
            router.push('/plan' as any);
          },
        },
      ]
    );
  };

  const leftColumn = posts.filter((_, idx) => idx % 2 === 0);
  const rightColumn = posts.filter((_, idx) => idx % 2 !== 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={20} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      {/* Category Pills */}
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

      {/* Masonry Feed with Swipeable Photo Carousels */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedScroll}
      >
        <View style={styles.gridRow}>
          <View style={styles.column}>
            {leftColumn.map((post) => (
              <FeedPostCard
                key={post.id}
                post={post}
                onPressCard={() => {
                  setSelectedGalleryIndex(0);
                  setActivePost(post);
                }}
                onToggleLike={() => handleToggleLike(post.id)}
              />
            ))}
          </View>
          <View style={styles.column}>
            {rightColumn.map((post) => (
              <FeedPostCard
                key={post.id}
                post={post}
                onPressCard={() => {
                  setSelectedGalleryIndex(0);
                  setActivePost(post);
                }}
                onToggleLike={() => handleToggleLike(post.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Detail, Comments & Clone Modal */}
      <Modal
        visible={!!activePost}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActivePost(null)}
      >
        <SafeAreaView style={styles.modalSafeArea} edges={['top', 'bottom']}>
          {activePost && (
            <View style={{ flex: 1 }}>
              <View style={styles.modalTopNav}>
                <TouchableOpacity
                  onPress={() => setActivePost(null)}
                  style={styles.modalCloseBtn}
                >
                  <Ionicons name="chevron-down" size={24} color="#111827" />
                </TouchableOpacity>
                <View style={styles.modalTopAuthor}>
                  <Image source={{ uri: activePost.avatarUrl }} style={styles.modalAvatar} />
                  <Text style={styles.modalAuthorName}>{activePost.author}</Text>
                </View>
                <TouchableOpacity
                  style={styles.cloneHeaderPill}
                  onPress={() => handleCloneItinerary(activePost)}
                >
                  <Ionicons name="copy-outline" size={13} color="#FFFFFF" />
                  <Text style={styles.cloneHeaderPillText}>Clone</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.modalScrollBody}
              >
                <Image
                  source={{ uri: activePost.gallery[selectedGalleryIndex] || activePost.imageUrl }}
                  style={styles.modalHeroImage}
                  resizeMode="cover"
                />

                {/* Multi-Photo Thumbnails */}
                <View style={styles.galleryPreviewSection}>
                  <Text style={styles.gallerySectionLabel}>
                    PHOTOS ({activePost.gallery.length})
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.galleryThumbnailRow}
                  >
                    {activePost.gallery.map((imgUri, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => setSelectedGalleryIndex(idx)}
                        style={[
                          styles.galleryThumbnailCard,
                          selectedGalleryIndex === idx && styles.galleryThumbnailActive,
                        ]}
                      >
                        <Image source={{ uri: imgUri }} style={styles.galleryThumbImg} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.modalContentPadding}>
                  <Text style={styles.modalLocation}>📍 {activePost.location}</Text>
                  <Text style={styles.modalTitle}>{activePost.title}</Text>

                  {/* Route Overview */}
                  <View style={styles.itinerarySummaryBox}>
                    <View style={styles.summaryTitleRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name="map-outline" size={16} color="#0D9488" />
                        <Text style={styles.summaryBoxHeading}>SHARED TRIP ROUTE</Text>
                      </View>
                      <Text style={styles.summaryDaysCount}>
                        {activePost.daysSummary.length} Days Planned
                      </Text>
                    </View>

                    {activePost.daysSummary.map((item) => (
                      <View key={item.day} style={styles.dayStopRow}>
                        <View style={styles.dayBadge}>
                          <Text style={styles.dayBadgeText}>Day {item.day}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.dayHighlightText}>{item.highlight}</Text>
                          <Text style={styles.dayCountText}>{item.placesCount} spots included</Text>
                        </View>
                      </View>
                    ))}

                    <TouchableOpacity
                      style={styles.cloneFullActionBtn}
                      activeOpacity={0.88}
                      onPress={() => handleCloneItinerary(activePost)}
                    >
                      <Ionicons name="duplicate" size={16} color="#FFFFFF" />
                      <Text style={styles.cloneFullActionBtnText}>
                        Clone Entire Itinerary into My Trips 📋
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Comments List */}
                  <View style={styles.commentsContainer}>
                    <Text style={styles.commentsSectionTitle}>
                      COMMENTS ({activePost.comments.length})
                    </Text>

                    {activePost.comments.map((comm) => (
                      <View key={comm.id} style={styles.commentItem}>
                        <Image source={{ uri: comm.avatar }} style={styles.commentAvatar} />
                        <View style={styles.commentBubble}>
                          <View style={styles.commentHeaderRow}>
                            <Text style={styles.commentUser}>{comm.user}</Text>
                            <Text style={styles.commentTime}>{comm.timeAgo}</Text>
                          </View>
                          <Text style={styles.commentBody}>{comm.text}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>

              {/* Bottom Interactive Input Bar with Keyboard Offset */}
              <Animated.View style={[styles.modalBottomBar, { marginBottom: keyboardHeight }]}>
                <TouchableOpacity
                  style={styles.bottomLikeButton}
                  onPress={() => handleToggleLike(activePost.id)}
                >
                  <Ionicons
                    name={activePost.isLiked ? 'heart' : 'heart-outline'}
                    size={22}
                    color={activePost.isLiked ? '#EF4444' : '#4B5563'}
                  />
                  <Text style={styles.bottomLikeText}>{activePost.likes}</Text>
                </TouchableOpacity>

                <TextInput
                  value={commentInput}
                  onChangeText={setCommentInput}
                  placeholder="Add a travel tip or ask author..."
                  placeholderTextColor="#9CA3AF"
                  style={styles.commentTextInput}
                />

                <TouchableOpacity
                  style={styles.sendCommentBtn}
                  onPress={handleAddComment}
                  disabled={!commentInput.trim()}
                >
                  <Ionicons
                    name="arrow-up"
                    size={16}
                    color="#FFFFFF"
                    style={{ opacity: commentInput.trim() ? 1 : 0.4 }}
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </SafeAreaView>
      </Modal>
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
    paddingBottom: 120,
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
  carouselImg: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.light.backgroundElement,
  },
  paginationDotsContainer: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  paginationDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 6,
  },
  multiPhotoBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  multiPhotoBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
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
    padding: 2,
  },
  likesCount: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  likesCountActive: {
    color: '#EF4444',
    fontWeight: '700',
  },

  /* Modal Styles */
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalTopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTopAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  modalAuthorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  cloneHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0D9488',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  cloneHeaderPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  modalScrollBody: {
    paddingBottom: 24,
  },
  modalHeroImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#E5E7EB',
  },
  galleryPreviewSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  gallerySectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  galleryThumbnailRow: {
    gap: 8,
  },
  galleryThumbnailCard: {
    width: 72,
    height: 52,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  galleryThumbnailActive: {
    borderColor: '#0D9488',
    borderWidth: 2,
  },
  galleryThumbImg: {
    width: '100%',
    height: '100%',
  },
  modalContentPadding: {
    padding: 16,
  },
  modalLocation: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
    textTransform: 'uppercase',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
    lineHeight: 24,
  },
  itinerarySummaryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 16,
  },
  summaryTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryBoxHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.6,
  },
  summaryDaysCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  dayStopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E2E8F0',
  },
  dayBadge: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  dayBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
  },
  dayHighlightText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  dayCountText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  cloneFullActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0D9488',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  cloneFullActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  commentsContainer: {
    marginTop: 4,
  },
  commentsSectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  commentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  commentUser: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  commentTime: {
    fontSize: 9,
    color: '#94A3B8',
  },
  commentBody: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
  },
  modalBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  bottomLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  bottomLikeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  commentTextInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
    color: '#0F172A',
  },
  sendCommentBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
});