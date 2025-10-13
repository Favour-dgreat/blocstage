"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { SiFacebook } from "@icons-pack/react-simple-icons";
import { CheckCircle, Mail } from "lucide-react";
import Footer from "@/components/Footer";

const features = [
  {
    icon: (
      <Image
        src="/images/polls.png"
        alt="Event Management"
        width={32}
        height={32}
        className="w-8 h-8 object-cover rounded-lg"
      />
    ),
    title: "Custom Event Pages",
    description:
      "Create stunning, branded event pages that reflect your unique style. Beautiful templates and tools to make everything look professional and aligned to your brand.",
  },
  {
    icon: (
      <Image
        src="/images/polls1.png"
        alt="Ticketing"
        width={32}
        height={32}
        className="w-8 h-8 object-cover rounded-lg"
      />
    ),
    title: "Free & Paid Ticketing",
    description:
      "Seamlessly sell tickets with our integrated payment system. No setup fees, transparent pricing, and tools to make selling tickets effortless. Accept fiat, crypto, or even host events.",
  },
  {
    icon: (
      <Image
        src="/images/polls2.png"
        alt="Communication Tools"
        width={32}
        height={32}
        className="w-8 h-8 object-cover rounded-lg"
      />
    ),
    title: "Communication Tools",
    description:
      "Engage attendees between talks via email newsletter or live chat. Send personalized messages to your audience directly through email, SMS, or push WhatsApp.",
  },
  {
    icon: (
      <Image
        src="/images/polls3.png"
        alt="Analytics & Reports"
        width={32}
        height={32}
        className="w-8 h-8 object-cover rounded-lg"
      />
    ),
    title: "Analytics & Reports",
    description:
      "Track who showed up, what they clicked, and what interested them most. Get detailed insights into your event's performance without needing a spreadsheet or a data team.",
  },
];

const engagementFeatures = [
  {
    icon: (
      <Image
        src="/images/active.png"
        alt="Live Polls & Q&A"
        width={32}
        height={32}
        className="w-10 h-10 object-cover rounded-lg"
      />
    ),
    title: "Live polls & Q&A",
  },
  {
    icon: (
      <Image
        src="/images/active2.png"
        alt="Interactive Quizzes & Surveys"
        width={32}
        height={32}
        className="w-10 h-10 object-cover rounded-lg"
      />
    ),
    title: "Interactive quizzes & surveys",
  },
  {
    icon: (
      <Image
        src="/images/active3.png"
        alt="Live Chat & Networking"
        width={32}
        height={32}
        className="w-10 h-10 object-cover rounded-lg"
      />
    ),
    title: "Feedback forms during and after events",
  },
  {
    icon: (
      <Image
        src="/images/active4.png"
        alt="Live Leaderboards"
        width={32}
        height={32}
        className="w-10 h-10 object-cover rounded-lg"
      />
    ),
    title: "Transparent raffle draws (web3 or without smart contracts)",
  },
];

const platformFeatures = [
  "Event pages",
  "Ticketing",
  "Payment(Fiat & Crypto)",
  "Communication tool",
  "Real-time engagement",
  "Analytics",
  "Rewards & bounties",
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState<
    "loading" | "success" | "error" | null
  >(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setSubmissionStatus("loading");

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyyq9pElfxTb7v3pkJ2tMdijEqQYne2sIvESgbjSKiyIXdZtymmLL3YI0T215bhApHcZg/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );


      // Check if the response status is within the success range (200-299)
      if (response.ok) {
        setSubmissionStatus("success");
        setEmail("");
      } else {
        // Log the error response body for more detail
        const errorText = await response.text();
        console.error("Failed to submit:", response.status, errorText);
        setSubmissionStatus("error");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmissionStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 p-4 ${
          isScrolled
            ? "bg-slate-900/95 backdrop-blur-sm shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between ">
            <div className="flex items-center">
              <Image
                src="/images/blocsagelogo.png"
                alt="BlocStage logo"
                width={96}
                height={96}
                className="object-contain"
                priority
              />
            </div>
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
             
              <a href="login">
                <Button className="bg-[#E04E1E] hover:bg-orange-600 text-white hover:cursor-pointer px-4 py-3 text-sm font-medium rounded-md">
                  Get Started
                </Button>
              </a>
            </div>
            {/* Mobile Nav Toggle */}
            <button
              className="md:hidden flex items-center px-3 py-2 border rounded text-white border-white"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle navigation"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    mobileNavOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
          {/* Mobile Nav Menu */}
          {mobileNavOpen && (
            <div className="md:hidden flex flex-col space-y-2 mt-2 pb-4">
              <a href="/login">
                <Button className="w-full outline-none text-white hover:cursor-pointer px-6 py-3 text-sm font-medium rounded-md">
                  Login
                </Button>
              </a>
              <a href="/signup">
                <Button className="w-full bg-[#E04E1E] hover:bg-orange-600 text-white hover:cursor-pointer px-6 py-3 text-sm font-medium rounded-md">
                  Get Started
                </Button>
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center bg-black px-4 sm:px-8 md:px-12 py-12 pt-32 md:pt-12">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/stellarhero.jpg')" }}
        >
          <div className="absolute inset-0 bg-black opacity-60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto text-left w-full px-2 sm:px-4 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight text-white mb-6">
              Host <span className="text-[#E04E1E]">Events</span> You
              Can Remember. Build <br />{" "}
              <span className="text-[#E04E1E]">Communities</span> That Last.
            </h1>
            <p className="text-xl sm:text-base md:text-xl text-white mb-8 font-normal max-w-2xl">
              An all-in-one platform that helps you plan, run, and grow
              meaningful events and community.
            </p>

            <div className="mb-8 sm:mb-10">
              <a href="/signup">
                <Button className="bg-[#E04E1E] hover:bg-orange-600 text-white px-6 py-3 text-sm font-medium rounded-md">
                  Get Started
                </Button>
              </a>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 sm:gap-x-8 sm:gap-y-4 text-white text-xl sm:text-xl font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#E04E1E]" />
                <span>Ticketing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#E04E1E]" />
                <span>Feedbacks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#E04E1E]" />
                <span>Audience Engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#E04E1E]" />
                <span>Rewards & Bounties</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Management Section */}
      <section className="py-10 sm:py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
          <div className="text-left mb-12">
            <p className="mb-4 text-[#E04E1E]">Event Management</p>
            <h2 className="text-3xl md:text-4xl max-w-2xl font-bold text-[#282828] mb-4">
              Everything You Need to Host Exceptional Events
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none w-40 h-40 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-[#FFE5D0] via-[#FFD1B3] to-[#FFB380] opacity-20 blur-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 relative z-10">
              {features.slice(0, 2).map((feature, index) => (
                <div key={index}>
                  <Card
                    className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                    style={{ padding: "20px" }}
                  >
                    <CardHeader>
                      <div className="mb-4 ">{feature.icon}</div>
                      <CardTitle className="text-xl font-semibold text-gray-900 max-w-3xl mb-4">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
              {features.slice(2, 4).map((feature, index) => (
                <div key={index + 2}>
                  <Card
                    className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                    style={{ padding: "20px" }}
                  >
                    <CardHeader>
                      <div className="mb-4 ">{feature.icon}</div>
                      <CardTitle className="text-xl font-semibold text-gray-900 mb-4">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Audience Engagement Section */}
      <section className="py-10 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative mb-8 lg:mb-0">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl"></div>
              <div className="relative p-2 sm:p-8 rounded-2xl">
                <Image
                  src="/images/Rectangle8.png"
                  alt="Audience Engagement"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 max-w-xl">
                Keep Your Audience <br className="hidden md:block" /> Active,
                Not Just <br className="hidden md:block" /> Present
              </h2>
              <div className="space-y-4 sm:space-y-6">
                {engagementFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#282828]">
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recognition & Rewards Section */}
      <section
        className="py-10 sm:py-16 md:py-24 relative"
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, rgba(15,15,15,0.85), rgba(30,30,30,0.80)), url('/images/jetpad.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl sm:px-4 lg:px-8 mx-auto px-2">
          <div className="text-left ">
            <h2 className="text-3xl md:text-4xl font-bold text-white px-4 max-w-2xl mb-12">
              Recognize contributions.
              <br className="hidden md:block" /> Reward engagement.{" "}
              <br className="hidden md:block" /> Track impact.
            </h2>
            <p className="text-xl text-gray-300 max-w-xl px-4 mb-4">
              BlocStage Earn isn’t just for events—it powers ongoing interaction
              within communities. Organizers and managers can post tasks,
              bounties, and challenges for members, whether public, exclusive,
              or tied to special events.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-row-1 text-xl">
            {[
              {
                icon: (
                  <Image
                    src="/images/blockk.png"
                    alt="Post Tasks & Bounties"
                    width={12}
                    height={12}
                    className="w-6 h-6 object-cover rounded-lg"
                  />
                ),
                title:
                  "Post tasks, bounties, or events for your community of event attendees",
              },
              {
                icon: (
                  <Image
                    src="/images/blockk.png"
                    alt="Post Tasks & Bounties"
                    width={12}
                    height={12}
                    className="w-6 h-6 object-cover rounded-lg"
                  />
                ),
                title:
                  "Acknowledge participants with badges, NFTs, certificates, or awards",
              },
              {
                icon: (
                  <Image
                    src="/images/blockk.png"
                    alt="Post Tasks & Bounties"
                    width={12}
                    height={12}
                    className="w-6 h-6 object-cover rounded-lg"
                  />
                ),
                title:
                  "Set prize pools for top NFT holder holders for events for each event",
              },
              {
                icon: (
                  <Image
                    src="/images/blockk.png"
                    alt="Post Tasks & Bounties"
                    width={40}
                    height={40}
                    className="w-6 h-6 object-cover "
                  />
                ),
                title:
                  "Use leaderboards and live boost participation and long-term engagement",
              },
            ].map((item, index) => (
              <Card key={index} className="text-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <p className="text-sm leading-relaxed">{item.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Building Section */}
      <section className="py-10 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
          <div className="text-left mb-12">
            <p className="mb-4 text-[#E04E1E]">Who Is It For?</p>
            <h2 className="text-3xl md:text-4xl max-w-xl font-bold text-[#282828]">
              Built for Anyone <br className="hidden md:block" /> Building a
              Community
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 text-center">
            <div className="flex flex-col items-center">
              <Image
                src="/images/1.png"
                alt="Creators & Event Organizers"
                width={200}
                height={160}
                className="w-full max-w-xl h-32 sm:h-40 object-cover rounded-lg shadow-md mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Creators & Event <br className="hidden md:block" />
                Organizers
              </h3>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src="/images/2.png"
                alt="Creators & Event Organizers"
                width={200}
                height={160}
                className="w-full max-w-xl h-32 sm:h-40 object-cover rounded-lg shadow-md mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Companies & <br className="hidden md:block" /> Founders
              </h3>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src="/images/3.png"
                alt="Creators & Event Organizers"
                width={200}
                height={160}
                className="w-full max-w-xl h-32 sm:h-40 object-cover rounded-lg shadow-md mb-4"
              />
              <h3 className="text-lg text-center font-semibold text-gray-900 mb-2">
                Ecosystem Builders & Community Managers
              </h3>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src="/images/4.png"
                alt="Creators & Event Organizers"
                width={200}
                height={160}
                className="w-full max-w-xl h-32 sm:h-40 object-cover rounded-lg shadow-md mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Marketers{" "}
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Web3 Ready Section */}
      <section
        className="py-10 sm:py-16 md:py-24 bg-[#476D8F]"
        id="waitlist-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl leading-loose font-bold text-white ">
                Traditional Friendly.
                 <br className="hidden md:block" /> Web3 Ready.
              </h2>
            </div>
            <div className="relative lg:mt-0">
              <p
                className="text-xl text-left text-blue-100 mb-8"
                style={{ maxWidth: "500px" }}
              >
                Use only what fits your audience. 
				<br /> <br/>
				BlocStage works beautifully as
                a traditional event tool and opens up next-gen engagement when
                you&#39;re ready.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row w-full max-w-md bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 border-none focus:outline-none text-gray-900 bg-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button
                    className="bg-[#E04E1E] hover:bg-orange-600 text-white px-2 py-4 sm:py-6 rounded-lg text-base font-semibold shadow-none transition w-full sm:w-auto"
                    type="submit"
                    style={{ minWidth: "auto" }}
                    disabled={submissionStatus === "loading"}
                  >
                    {submissionStatus === "loading"
                      ? "Joining..."
                      : "Subscribe to our newsletter"}
                  </Button>
                </div>
                {submissionStatus === "success" && (
                  <p className="mt-4 text-white text-sm">
                    🎉 You&apos;ve successfully joined the waitlist!
                  </p>
                )}
                {submissionStatus === "error" && (
                  <p className="mt-4 text-red-400 text-sm">
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* All-in-One Platform Section */}
      <section className="py-10 sm:py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-12 max-w-md text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Ditch the Tool Stack
              <br className="hidden md:block" />— BlocStage Has It All
            </h2>
          </div>

          <div className="mx-2 max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-y-4 sm:gap-y-6 gap-x-8 sm:gap-x-8">
            {platformFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <Image
                  src="/images/Icon.png"
                  alt=""
                  width={34}
                  height={34}
                  className="w-6 h-6 object-cover"
                />
                <span className="font-semibold text-gray-900">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
