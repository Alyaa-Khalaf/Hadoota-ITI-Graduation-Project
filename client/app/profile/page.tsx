import ParentInfoForm from "../components/dashboard/ParentInfoForm";
import HomeButton from "../components/ui/HomeButton";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-10">
      <HomeButton href="/" />
      <ParentInfoForm />
    </div>
  );
}