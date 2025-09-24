//! Components

//? Home Page
import HomePage from "../pages/home_page/HomePage.jsx";
import Hero from "../components/home/Hero.jsx";
import WhyUs from "../components/home/WhyUs.jsx";
// import WhatIsMedihub from "../components/home/WhatIsMedihub.jsx";
import Testimonials from "../components/home/Testimonials.jsx";
import DoctorsSection from "../components/home/DoctorsSection.jsx";
// import OurContributors from "../components/Home/OurContributors.jsx";

//? Login & Signup
import LoginPage from "../pages/login_signup_page/LoginPage.jsx";
import SignupPage from "../pages/login_signup_page/SignupPage.jsx";
import ForgotPasswordPage from "../pages/login_signup_page/ForgotPasswordPage.jsx";

//? Error
import ErrorPage from "../pages/error_page/ErrorPage.jsx";
//? Faqs
import FaqsPage from "../pages/faqs_page/FaqsPage.jsx";
import FaqsCard from "../components/FaqsCard.jsx";
//? About Us
import AboutUsPage from "../pages/about_us_page/AboutUsPage.jsx";
//? Terms and Conditions
import TermsAndConditionsPage from "../pages/terms_&_conditions_page/TermsAndConditionsPage.jsx";
//? Privacy Policy
import PrivacyPolicyPage from "../pages/privacy_policy_page/PrivacyPolicyPage.jsx";

//? Patient's Dashboard

//? Doctor's Dashboard

//? Admin's Dashboard

//TODO:  Constant components
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import SkeletonLoading from "../components/SkeltonLoading.jsx";
import Bot from "../components/bot/Bot.jsx";
import GoToTop from "../components/GoToTop.jsx";
import Pagination from "../components/Pagination.jsx";

//! Axios instance
import axios from "../axios/axios.jsx";

//! API utility
import api from "../utils/api.js";

//! Custom hooks
import useLoading from "../../hooks/useLoading.js";

export {
  axios, api, Navbar, Footer, SkeletonLoading, ErrorPage, HomePage, Hero, WhyUs, Testimonials, DoctorsSection, LoginPage, SignupPage, ForgotPasswordPage, AboutUsPage, TermsAndConditionsPage, PrivacyPolicyPage, FaqsPage, FaqsCard,
  GoToTop, Pagination,
  Bot, useLoading
};