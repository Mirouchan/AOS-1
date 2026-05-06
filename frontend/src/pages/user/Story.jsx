import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Calendar, Clock, ArrowLeft, User, Tag, Heart, Share2, Bookmark, MessageCircle, Twitter, Facebook, Linkedin, Link as LinkIcon } from "lucide-react";
import { journalPosts, getRelatedPosts, getPopularTags } from "../../data/fakeJournal";

const Story = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const foundPost = journalPosts.find(p => p.id === parseInt(id));
    if (foundPost) {
      setPost(foundPost);
      setRelatedPosts(getRelatedPosts(foundPost.id, foundPost.category));
      setPopularTags(getPopularTags());
    }
    setLoading(false);
  }, [id]);

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

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out "${post.title}" on TerraVentures Journal!`;
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(post.title)}`,
    };
    if (shareUrls[platform]) window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="bg-light-background dark:bg-dark-background min-h-screen">
        <Navbar scrolled={scrolled} />
        <div className="container mx-auto px-6 py-32 text-center">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-light-background dark:bg-dark-background min-h-screen">
        <Navbar scrolled={scrolled} />
        <div className="container mx-auto px-6 py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Story Not Found</h1>
          <Link to="/journal" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-light-primary to-orange-500 text-black font-bold rounded-lg">Back to Journal</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text min-h-screen">
      <Navbar scrolled={scrolled} />

      <section className="relative pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Link to="/journal" className="inline-flex items-center gap-2 text-light-primary hover:gap-3 transition-all mb-6"><ArrowLeft className="w-4 h-4" /> Back to Journal</Link>
            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 ${getCategoryColor(post.category)}`}>{post.category}</span>
            <h1 className="text-4xl lg:text-5xl font-bebas mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-6">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{post.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readTime}</span>
              <span className="flex items-center gap-1"><User className="w-4 h-4" />By {post.author}</span>
            </div>
            <img src={post.image} alt={post.title} className="w-full rounded-2xl shadow-xl mb-8" />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-3">
              <div className="max-w-3xl mx-auto">
                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bebas prose-p:text-gray-600" dangerouslySetInnerHTML={{ __html: post.content }} />
                
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-500" />
                      {post.tags.map((tag, index) => (<Link key={index} to={`/journal?tag=${tag}`} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-light-primary/20">#{tag}</Link>))}
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <button onClick={() => setLiked(!liked)} className={`flex items-center gap-2 px-4 py-2 rounded-full ${liked ? "bg-red-500 text-white" : "bg-gray-100 hover:bg-red-100"}`}><Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />{liked ? "Liked" : "Like"}</button>
                      <button onClick={() => setSaved(!saved)} className={`flex items-center gap-2 px-4 py-2 rounded-full ${saved ? "bg-light-primary text-black" : "bg-gray-100 hover:bg-light-primary/20"}`}><Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />{saved ? "Saved" : "Save"}</button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Share:</span>
                      <button onClick={() => handleShare("twitter")} className="p-2 bg-gray-100 rounded-full hover:bg-blue-400 hover:text-white"><Twitter className="w-4 h-4" /></button>
                      <button onClick={() => handleShare("facebook")} className="p-2 bg-gray-100 rounded-full hover:bg-blue-600 hover:text-white"><Facebook className="w-4 h-4" /></button>
                      <button onClick={() => handleShare("linkedin")} className="p-2 bg-gray-100 rounded-full hover:bg-blue-700 hover:text-white"><Linkedin className="w-4 h-4" /></button>
                      <button onClick={copyToClipboard} className="p-2 bg-gray-100 rounded-full hover:bg-light-primary hover:text-black"><LinkIcon className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <img src={post.authorAvatar} alt={post.author} className="w-16 h-16 rounded-full object-cover" />
                    <div><h3 className="font-bold text-lg mb-1">{post.author}</h3><p className="text-sm text-gray-600">{post.authorBio}</p></div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-2xl font-bebas mb-4">Comments</h3>
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                    <button className="mt-4 px-6 py-2 bg-gradient-to-r from-light-primary to-orange-500 text-black font-bold rounded-lg">Leave a Comment</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {popularTags && popularTags.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                    <h3 className="font-bebas text-xl mb-4">Popular Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.slice(0, 10).map((tag, index) => (<Link key={index} to={`/journal?tag=${tag.name}`} className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm hover:bg-light-primary/20">#{tag.name} ({tag.count})</Link>))}
                    </div>
                  </div>
                )}

                {relatedPosts && relatedPosts.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                    <h3 className="font-bebas text-xl mb-4">Related Stories</h3>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (<Link key={relatedPost.id} to={`/story/${relatedPost.id}`} className="group flex gap-3 hover:bg-white p-3 rounded-lg transition-all">
                        <img src={relatedPost.image} alt={relatedPost.title} className="w-16 h-16 rounded-lg object-cover" />
                        <div><h4 className="font-semibold text-sm group-hover:text-light-primary line-clamp-2">{relatedPost.title}</h4><p className="text-xs text-gray-500 mt-1">{relatedPost.date}</p></div>
                      </Link>))}
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-light-primary/10 to-orange-500/10 rounded-xl p-6">
                  <h3 className="font-bebas text-xl mb-2">Never Miss a Story</h3>
                  <p className="text-sm text-gray-600 mb-4">Get the latest adventure stories delivered to your inbox.</p>
                  <input type="email" placeholder="Your email" className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 mb-3" />
                  <button className="w-full py-2 bg-gradient-to-r from-light-primary to-orange-500 text-black font-bold rounded-lg">Subscribe</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Story;