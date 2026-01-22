import Image from "next/image";
import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Section from "./components/Section";
import Card from "./components/Card";
import Content from "./components/how_it_works/Content";
import Feature from "./components/more_about_ghumakker/Feature";
import Tile from "./components/why_choose_ghumakker/Tile";
import styles from "./prelaunch.module.css"
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { APP_BRANDING } from "@/lib/constants/assets";

/**
 * Home Page Component
 * Main landing page for ghumakker platform
 * Showcases services, how it works, features, and call-to-action
 */
export default function Home() {
  return (
    <>
      <Header
        button={{
          link: "/prelaunch/travelers",
          text: "For Travelers"

        }} />
      <main className="px-[1rem] md:px-[5.5rem] relative w-full overflow-hidden max-w-[1500px] mx-auto">
        {/* Hero Section */}
        <Hero />


        {/* We are here to Offer you */}
        <Section heading="We are here to Offer you" child={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2.5rem] max-md:justify-center">
            <Card
              heading="Community Growth"
              img="/prelaunch-page-imgs/community.png"
              listItems={["Grow your travel community on a platform built exclusively for organized group trips",
                "Be discovered by travelers   searching for destination, budget, dates, and activities that you provide.",
              ]}
            />
            <Card
              heading="Savings On Marketing Cost"
              img="/prelaunch-page-imgs/savings.png"
              listItems={[
                `Save costs on marketing let ${APP_BRANDING} bring the audience to you.`,
                `Boost your appearance with ${APP_BRANDING}'s advanced search filters.`,
                "Stand out with reviews and community presence that builds trust."
              ]}
            />
            <Card
              heading="Analytics That Matter"
              img="/prelaunch-page-imgs/analytics.png"
              listItems={[
                "See what travelers want, when, and at what price.",
                "Access market trends and demand forecasts.",
                "Turn traveler search trends into smarter trip planning."
              ]}
            />
          </div>
        } />

        {/* How It Works */}
        <Section heading="How It Works" child={
          <div className="flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-y-[2rem] w-[90%]">
              {/* Step 1 */}
              <div className="md:px-6 order-1">
                <Image src="/prelaunch-page-imgs/hiw-1.png" alt="How It Works Image" width={2000} height={1000} className="w-full" />
              </div>
              <Content Heading="Create Account" content="Quick and seamless organizer account creation" direction="right" optional="order-2" />
              {/* Step 2 */}
              <Content Heading="List Trips " content="List your organized group trips and appear in traveler searches instantly" direction="left" optional="max-sm:order-4 order-3" />
              <div className="md:px-6 max-sm:order-3 order-4">
                <Image src="/prelaunch-page-imgs/hiw-2.png" alt="How It Works Image" width={2000} height={1000} className="w-full" />
              </div>
              {/* Step 3 */}
              <div className="md:px-6 order-5">
                <Image src="/prelaunch-page-imgs/hiw-3.png" alt="How It Works Image" width={2000} height={1000} className="w-full" />
              </div>
              <Content Heading="Convert" content="View leads and convert them into confirmed bookings" direction="right" optional="order-6" />
              {/* Step 4 */}
              <Content Heading="Grow" content={`Use ${APP_BRANDING} Analytics for smarter group trip planning`} direction="left" optional="order-7 max-sm:order-8" />
              <div className="md:px-6 order-8 max-sm:order-7">
                <Image src="/prelaunch-page-imgs/hiw-4.png" alt="How It Works Image" width={2000} height={1000} className="w-full" />
              </div>
            </div>

          </div>

        } />


        {/* More About ghumakker */}
        <Section heading={<>More About <span className={styles.grad_txt}>{APP_BRANDING}</span>
          <p className="text-[1.5rem] md:text-[2rem] barlow font-[550] italic text-center text-[#575757] mt-2"> {APP_BRANDING} is the only one in India! That...</p>
        </>} child={
          <>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 italic">
              <Feature img="/prelaunch-page-imgs/mar-group.png"
                title="Enables you to list your group trips on a platform dedicated to fixed departure group trips."
                description="So that your every seat is booked on time" />
              <Feature img="/prelaunch-page-imgs/mar-travel.png"
                title="Enables travelers to search and filter group trips based on the experience parted during the trip."
                description="Because it’s not just about the destination, it’s the memories we make there" />
              <Feature img="/prelaunch-page-imgs/mar-insights.png"
                title="Provides you access to data and insights of traveler behavior and market trends."
                description="So that you know what travelers’ actually want" />
              <Feature img="/prelaunch-page-imgs/mar-trust.png"
                title="Puts your brand identity at the forefront."
                description="Because travelers are not just looking for trips, they are looking for brands they can trust" />
            </div>
          </>
        } />

        {/* Why Travelers Choose ghumakker */}
        <Section heading={<>Why Travelers Choose <span className={styles.grad_txt}>{APP_BRANDING}</span></>} child={
          <>
            <div className="max-md:p-0 grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8">
              <Image src="/prelaunch-page-imgs/travellers-ghumakker.webp" alt={`Why Travelers Choose ${APP_BRANDING}`} width={2000} height={1000} className=" max-md:mx-auto md:w-full" />
              <div className="flex flex-col justify-center">
                <Tile img="/prelaunch-page-imgs/wcr-search.png" title="Simple, clutter-free search to find the right group trips" />
                <Tile img="/prelaunch-page-imgs/wcr-fitler.png" title="Filter by destination, moods, budget and duration" />
                <Tile img="/prelaunch-page-imgs/wcr-file.png" title="Transparent view of all organizer options" />
                <Tile img="/prelaunch-page-imgs/wcr-community.png" title="Community driven reviews" />
              </div>
            </div>
          </>


        } />

        {/* When travelers choose ghumakker, they choose you! Banner section*/}
        <Section heading={<>When travelers choose <span className={styles.grad_txt}>{APP_BRANDING}</span>, they <br /><span className="grad_txt">choose you!</span></>} child={
          <div className="banner_section md:mt-[1.5rem] w-full min-h-[450px] flex max-md:justify-center align-center items-center rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 bg-[url('/prelaunch-page-imgs/banner.jpg')] bg-cover bg-center">
            <div className="w-full max-md:mx-auto md:w-[60%] rounded-[1.5rem] md:rounded-[2rem] border border-white p-6 md:py-6 md:px-8 h-[calc(100%-4rem)] bg-[rgba(0,0,0,0.3)] backdrop-blur-[5px]">
              <h1 className={`${styles.barlow} text-[3.5rem] md:text-[4rem] font-[700] text-white`}>
                Join the Movement!
              </h1>
              <p className="text-[1.25rem] md:text-[1.5rem] text-white py-6 md:py-[1.75rem]">Get started today and be discovered by millions of eager travelers</p>

              <Link href="/organizer/join-as-partner" >
                <button className="bg-white max-md:justify-center max-md:w-full group rounded-full px-6 py-[0.8rem] text-[1rem] flex items-center gap-2 transition-all duration-500 cursor-pointer">
                  <span className="group-hover:opacity-0 transition-all duration-300 text-[1.25rem] font-[500]"> Join as Partner</span>
                  <MoveRight className="inline-block group-hover:block group-hover:translate-x-[-5rem] transition-all duration-500 group-hover:scale-x-150" size={24} />
                </button>
              </Link>

            </div>
          </div>
        } />
      </main>
      <Footer />
    </>
  );
}
