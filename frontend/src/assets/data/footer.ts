import { FaYoutube, FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";
import { Mail, MapPin, type LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

interface SocialIcons {
  label: string;
  icon: IconType;
  url: string;
  brandColor: string;
}

interface ContactIconsType {
  label: string;
  icon: LucideIcon;
  contactInfo: string;
}

type QuickLinksType = Omit<SocialIcons, "icon" | "brandColor">;
type ResourcesType = QuickLinksType;

export const socialIcons: SocialIcons[] = [
  {
    label: "YouTube",
    icon: FaYoutube,
    url: "",
    brandColor: "#ff0000",
  },
  {
    label: "GitHub",
    icon: FaGithub,
    url: "",
    brandColor: "#000000",
  },
  {
    label: "LinkedIn",
    icon: FaLinkedin,
    url: "",
    brandColor: "#0077b5",
  },
  {
    label: "Discord",
    icon: FaDiscord,
    url: "",
    brandColor: "#5865f2",
  },
];

export const quickLinks: QuickLinksType[] = [
  {
    url: "/",
    label: "Home",
  },
  {
    url: "/about",
    label: "About",
  },
  {
    url: "/dashboard",
    label: "Dashboard",
  },
  {
    url: "/contact",
    label: "Contact",
  },
  {
    url: "/suppliers",
    label: "Suppliers",
  },
];

export const resourcesData: ResourcesType[] = [
  { url: "", label: "Case Studies" },
  { url: "", label: "Video Tutorials" },
  { url: "", label: "Sustainability Reports" },
  { url: "", label: "Documentation" },
];

export const contactIcons: ContactIconsType[] = [
  { label: "Email Address", icon: Mail, contactInfo: "info@proqure.com" },
  { label: "Our Location", icon: MapPin, contactInfo: "Nairobi, Kenya" },
];
