import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Compass,
  BookOpen,
  Mountain,
  Tent,
  Users,
  Leaf,
  Search,
  X
} from "lucide-react";
import { journalPosts } from "../../data/fakeJournal";

const Journal = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const postsPerPage = 6;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Get category from URL params on load
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const tagParam = searchParams.get("tag");
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
    if (tagParam) {
      setSearchQuery(tagParam);
    }
  }, [searchParams]);

  const categories = [
    { id: "all", name: "All Stories", icon: BookOpen, count: journalPosts.length },
    { id: "guides", name: "Guides", icon: Compass, count: journalPosts.filter(p => p.category === "guides").length },
    { id: "inspiration", name: "Inspiration", icon: Mountain, count: journalPosts.filter(p => p.category === "inspiration").length },
    { id: "gear", name: "Gear", icon: Tent, count: journalPosts.filter(p => p.category === "gear").length },
    { id: "sustainability", name: "Sustainability", icon: Leaf, count: journalPosts.filter(p => p.category === "sustainability").length },
    { id: "community", name: "Community", icon: Users, count: journalPosts.filter(p => p.category === "community").length },
  ];

  // Filter posts based on category and search
  const filteredPosts = journalPosts.filter(post => {
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
                          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
    if (categoryId === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", categoryId);
    }
    setSearchParams(searchParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      searchParams.set("q", searchQuery);
    } else {
      searchParams.delete("q");
    }
    setSearchParams(searchParams);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    searchParams.delete("q");
    searchParams.delete("tag");
    setSearchParams(searchParams);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCategoryColor = (category) => {
    const colors = {
      guides: "bg-light-primary dark:bg-dark-primary text-black",
      inspiration: "bg-orange-500 text-white",
      gear: "bg-blue-500 text-white",
      sustainability: "bg-green-500 text-white",
      community: "bg-purple-500 text-white"
    };
    return colors[category] || "bg-gray-500 text-white";
  };

  // Get featured post (first featured or first post)
  const featuredPost = journalPosts.find(p => p.featured) || journalPosts[0];

  return (
    <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text min-h-screen transition-colors duration-300">
      <Navbar scrolled={scrolled} />

      {/* Hero Section - The Journal */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-light-primary/80 to-dark-primary/80 dark:from-dark-primary/80 dark:to-light-primary/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-6xl lg:text-8xl font-bebas text-white mb-6 tracking-tight">
            The Journal
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Tales from the trail, gear guides, and inspiration for your next great escape.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stories by title, topic, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-light-primary focus:border-transparent outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mt-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-5 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-light-primary to-orange-500 dark:from-dark-primary dark:to-orange-400 text-black shadow-lg"
                    : "bg-white/10 text-white border border-white/30 hover:bg-white/20"
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
                <span className="text-xs ml-1 opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-24 bg-light-background dark:bg-dark-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Search Results Info */}
          {searchQuery && (
            <div className="mb-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Showing results for: <span className="font-semibold text-light-primary dark:text-dark-primary">"{searchQuery}"</span>
                <button onClick={clearSearch} className="ml-2 text-sm hover:underline">Clear</button>
              </p>
            </div>
          )}

          {/* Featured Post (only on first page, no search, all categories) */}
          {activeCategory === "all" && searchQuery === "" && currentPage === 1 && featuredPost && (
            <div className="mb-16">
              <Link to={`/story/${featuredPost.id}`} className="group block">
                <div className="relative rounded-3xl overflow-hidden">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 ${getCategoryColor(featuredPost.category)}`}>
                      {featuredPost.category.charAt(0).toUpperCase() + featuredPost.category.slice(1)}
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bebas mb-3">
                      {featuredPost.title}
                    </h2>
                    <p className="text-white/80 mb-4 max-w-2xl line-clamp-2">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-white/70">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {featuredPost.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Posts Grid */}
          {currentPosts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-light-primary/50 dark:text-dark-primary/50 mx-auto mb-4" />
              <h3 className="text-2xl font-bebas mb-2">No stories found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or category filter.
              </p>
              <button
                onClick={clearSearch}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-light-primary to-orange-500 text-black font-bold rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map((post) => (
                  <article 
                    key={post.id}
                    className="group bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <Link to={`/story/${post.id}`}>
                      <div className="h-56 overflow-hidden relative">
                        <img 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          alt={post.title} 
                          src={post.image}
                        />
                        <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </span>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {post.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                        <h3 className="text-xl font-bebas text-light-text dark:text-dark-text mb-3 group-hover:text-light-primary dark:group-hover:text-dark-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img 
                              src={post.authorAvatar} 
                              alt={post.author}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-xs font-medium text-light-text dark:text-dark-text">
                              {post.author}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-light-primary dark:text-dark-primary font-semibold text-sm group-hover:gap-2 transition-all">
                            Read More
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-light-primary hover:text-black hover:border-light-primary dark:hover:bg-dark-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={i}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold transition-all ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-light-primary to-orange-500 dark:from-dark-primary dark:to-orange-400 text-black shadow-md"
                              : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-light-primary/10 dark:hover:bg-dark-primary/10"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      (pageNum === currentPage - 2 && currentPage > 3) ||
                      (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return <span key={i} className="w-10 h-10 flex items-center justify-center">...</span>;
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-light-primary hover:text-black hover:border-light-primary dark:hover:bg-dark-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-light-primary/5 to-orange-500/5 dark:from-dark-primary/5 dark:to-orange-500/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bebas text-light-primary dark:text-dark-primary mb-4">
            Join The Adventure
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Get travel tips, destination guides, and exclusive offers delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              className="flex-1 px-6 py-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-light-primary dark:focus:border-dark-primary focus:ring-1 focus:ring-light-primary dark:focus:ring-dark-primary outline-none transition-all" 
              placeholder="Enter your email" 
              type="email"
              required
            />
            <button 
              className="bg-gradient-to-r from-light-primary to-orange-500 dark:from-dark-primary dark:to-orange-400 hover:from-light-primary/90 hover:to-orange-600 text-black font-bold px-8 py-3 rounded-full transition-all shadow-lg hover:shadow-light-primary/30 dark:hover:shadow-dark-primary/30" 
              type="submit"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Journal;