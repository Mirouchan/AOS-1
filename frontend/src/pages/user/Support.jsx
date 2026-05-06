import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { 
  Package, 
  RefreshCw, 
  ShieldCheck, 
  Send, 
  Phone, 
  Mail, 
  ChevronDown,
  MapPin,
  Clock,
  MessageCircle,
  HelpCircle,
  Truck,
  CreditCard,
  RotateCcw,
  Globe,
  CheckCircle
} from "lucide-react";

const Support = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [formStatus, setFormStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setFormStatus({
        type: "success",
        message: "Thank you for your message! Our support team will respond within 24 hours."
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setSubmitting(false);
      
      // Clear success message after 5 seconds
      setTimeout(() => setFormStatus(null), 5000);
    }, 1500);
  };

  const supportCards = [
    {
      icon: Package,
      title: "Track Order",
      description: "Check shipping status",
      link: "/track-order",
      color: "from-light-primary to-orange-500"
    },
    {
      icon: RefreshCw,
      title: "Returns",
      description: "30-day return policy",
      link: "/returns",
      color: "from-light-primary to-orange-500"
    },
    {
      icon: ShieldCheck,
      title: "Warranty",
      description: "Product protection info",
      link: "/warranty",
      color: "from-light-primary to-orange-500"
    }
  ];

  const faqs = [
    {
      question: "How fast is shipping?",
      answer: "Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available at checkout for an additional fee. Free shipping on all orders over $100."
    },
    {
      question: "Can I cancel my order?",
      answer: "Orders can be cancelled within 1 hour of placement. After that, they enter processing and cannot be cancelled. Please contact our support team immediately if you need to cancel."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes! We ship to over 50 countries worldwide. Shipping rates and delivery times vary by location and are calculated at checkout."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order in your account dashboard under 'My Orders'."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All transactions are secure and encrypted."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day hassle-free return policy. Items must be unused and in original packaging. Return shipping is free for defective items."
    }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text min-h-screen transition-colors duration-300">
      <Navbar scrolled={scrolled} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-light-primary/10 via-transparent to-light-primary/5 dark:from-dark-primary/10">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-black text-light-text dark:text-dark-text uppercase tracking-tight mb-4">
              How Can We Help?
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Track orders, returns, or technical support. Our team responds within 2 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Support Cards Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {supportCards.map((card, index) => (
              <Link
                key={index}
                to={card.link}
                className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-light-primary dark:hover:border-dark-primary transition-all text-center hover:shadow-xl"
              >
                <div className="w-16 h-16 mx-auto bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <card.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-light-text dark:text-dark-text">
                  {card.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{card.description}</p>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-black text-light-text dark:text-dark-text uppercase tracking-tight mb-8">
                Send Us a Message
              </h2>
              
              {formStatus && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                  formStatus.type === "success" 
                    ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                    : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                }`}>
                  <CheckCircle className="w-5 h-5" />
                  <p>{formStatus.message}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-light-text dark:text-dark-text mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-light-primary dark:focus:border-dark-primary focus:ring-1 focus:ring-light-primary dark:focus:ring-dark-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-light-text dark:text-dark-text mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-light-primary dark:focus:border-dark-primary focus:ring-1 focus:ring-light-primary dark:focus:ring-dark-primary outline-none transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-light-text dark:text-dark-text mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-light-primary dark:focus:border-dark-primary focus:ring-1 focus:ring-light-primary dark:focus:ring-dark-primary outline-none transition-all"
                  >
                    <option value="">Select a subject</option>
                    <option value="order-status">Order Status</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="return-request">Return Request</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-light-text dark:text-dark-text mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-light-primary dark:focus:border-dark-primary focus:ring-1 focus:ring-light-primary dark:focus:ring-dark-primary outline-none transition-all resize-none"
                    placeholder="Describe your issue or question in detail..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-light-primary to-orange-500 dark:from-dark-primary dark:to-orange-400 hover:from-light-primary/90 hover:to-orange-600 text-black font-bold rounded-xl shadow-lg shadow-light-primary/30 dark:shadow-dark-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* FAQ & Info */}
            <div className="space-y-12">

              {/* Direct Contact Info */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center text-light-primary dark:text-dark-primary shadow-sm flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-light-text dark:text-dark-text">Call Us</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">+1 (800) 555-0123</p>
                      <span className="text-xs text-green-500 font-bold">Available 24/7</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center text-light-primary dark:text-dark-primary shadow-sm flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-light-text dark:text-dark-text">Email Us</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">support@terrasventures.com</p>
                      <span className="text-xs text-gray-400 font-bold">Response: ~2h</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div>
                <h2 className="text-2xl font-black text-light-text dark:text-dark-text uppercase tracking-tight mb-6 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-light-primary dark:text-dark-primary" />
                  Frequently Asked
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 text-left font-bold text-light-text dark:text-dark-text hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${
                            activeFaq === index ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          activeFaq === index ? "max-h-40" : "max-h-0"
                        }`}
                      >
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg text-light-text dark:text-dark-text mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-light-primary dark:text-dark-primary" />
                  Business Hours
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 8:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Saturday</span>
                    <span className="font-medium">10:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </div>

              {/* Live Chat CTA */}
              <div className="bg-gradient-to-r from-light-primary/10 to-orange-500/10 dark:from-dark-primary/10 dark:to-orange-500/10 rounded-2xl p-6 border border-light-primary/20 dark:border-dark-primary/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-light-primary/20 dark:bg-dark-primary/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-light-primary dark:text-dark-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-light-text dark:text-dark-text">Live Chat Support</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Chat with our support team in real-time</p>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-light-primary to-orange-500 dark:from-dark-primary dark:to-orange-400 text-black font-bold rounded-lg text-sm hover:shadow-lg transition-all">
                    Start Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Helpful Resources Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-light-text dark:text-dark-text uppercase tracking-tight mb-4">
              Helpful Resources
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Quick links to common support topics
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link to="/track-order" className="text-center group">
              <div className="w-16 h-16 mx-auto bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-light-primary/10 dark:group-hover:bg-dark-primary/10 transition-colors">
                <Truck className="w-7 h-7 text-light-primary dark:text-dark-primary" />
              </div>
              <span className="text-sm font-medium text-light-text dark:text-dark-text group-hover:text-light-primary dark:group-hover:text-dark-primary transition-colors">
                Track Order
              </span>
            </Link>
            <Link to="/returns" className="text-center group">
              <div className="w-16 h-16 mx-auto bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-light-primary/10 dark:group-hover:bg-dark-primary/10 transition-colors">
                <RotateCcw className="w-7 h-7 text-light-primary dark:text-dark-primary" />
              </div>
              <span className="text-sm font-medium text-light-text dark:text-dark-text group-hover:text-light-primary dark:group-hover:text-dark-primary transition-colors">
                Returns Policy
              </span>
            </Link>
            <Link to="/shipping" className="text-center group">
              <div className="w-16 h-16 mx-auto bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-light-primary/10 dark:group-hover:bg-dark-primary/10 transition-colors">
                <Globe className="w-7 h-7 text-light-primary dark:text-dark-primary" />
              </div>
              <span className="text-sm font-medium text-light-text dark:text-dark-text group-hover:text-light-primary dark:group-hover:text-dark-primary transition-colors">
                Shipping Info
              </span>
            </Link>
            <Link to="/payment" className="text-center group">
              <div className="w-16 h-16 mx-auto bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-light-primary/10 dark:group-hover:bg-dark-primary/10 transition-colors">
                <CreditCard className="w-7 h-7 text-light-primary dark:text-dark-primary" />
              </div>
              <span className="text-sm font-medium text-light-text dark:text-dark-text group-hover:text-light-primary dark:group-hover:text-dark-primary transition-colors">
                Payment Methods
              </span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Support;