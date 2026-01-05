import {
  BookMarkedIcon,
  CameraIcon,
  Edit3Icon,
  ExternalLinkIcon,
  LogOutIcon,
  SettingsIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { use } from "react";
import ImageUploader from "@/components/image-uploader";
import SignOutButton from "@/components/signout-button";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import DummyProfile from "@/public/profile_dummy.png";
import { updateProfileImage } from "../sign/sign.action";
import ChageProfile from "./change-profile";
import WithDrawButton from "./withdraw-buttons";

export default function My() {
  const session = use(auth());
  if (!session?.user?.name) redirect("/sign");
  // const { data, update } = useSession();
  // const updateInfo = async (formData: FormData) => {};

  const { name, image } = session.user;

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Profile Header */}
        <div className="glass mb-8 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
            {/* Avatar */}
            <div className="group relative">
              <ImageUploader src={image || DummyProfile} alt={name} changeImage={updateProfileImage} />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="mb-2 flex flex-col items-center gap-3 sm:flex-row">
                <h1 className="font-bold font-heading text-2xl sm:text-3xl">{name}</h1>
                <span className="text-muted-foreground">@test</span>
              </div>
              <p className="mb-4 max-w-lg text-muted-foreground">test | test</p>

              {/* Stats */}
              <div className="mb-6 flex justify-center gap-6 md:justify-start">
                <button className="text-center transition-colors hover:text-primary">
                  <div className="font-bold text-xl sm:text-2xl">11</div>
                  <div className="text-muted-foreground text-sm">팔로워</div>
                </button>
                <button className="text-center transition-colors hover:text-primary">
                  <div className="font-bold text-xl sm:text-2xl">22</div>
                  <div className="text-muted-foreground text-sm">팔로잉</div>
                </button>
                <div className="text-center">
                  <div className="font-bold text-xl sm:text-2xl">33</div>
                  <div className="text-muted-foreground text-sm">컬렉션</div>
                </div>
              </div>

              {/* Action Buttons */}
              {/* <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                <Button variant="hero">
                  <Edit3Icon className="h-4 w-4" />
                  프로필 편집
                </Button>
                <Button variant="outline">
                  <SettingsIcon className="h-4 w-4" />
                  설정
                </Button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="collections" className="space-y-6">
          <TabsList className="glass w-fit justify-start">
            <TabsTrigger value="collections" className="flex-1 gap-2 sm:flex-none">
              <BookMarkedIcon className="h-4 w-4" />내 컬렉션
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 gap-2 sm:flex-none">
              <SettingsIcon className="h-4 w-4" />
              계정 설정
            </TabsTrigger>
          </TabsList>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-xl">내 컬렉션 ()</h2>
              <Button variant="hero" size="sm">
                <BookMarkedIcon className="h-4 w-4" />새 컬렉션
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="#" className="glass group rounded-xl p-5 transition-all hover:border-primary/30">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-semibold text-lg transition-colors group-hover:text-primary">11</h3>
                    </div>
                    <p className="line-clamp-2 text-muted-foreground text-sm"></p>
                  </div>
                  <ExternalLinkIcon className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                  <span className="flex items-center gap-1">
                    <BookMarkedIcon className="h-4 w-4" />
                  </span>
                </div>

                <div className="mt-3 flex gap-2"></div>
              </Link>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <ChageProfile user={session.user} />
            {/* Danger Zone */}
            <div className="glass rounded-xl border-destructive/30 p-6">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-destructive text-lg">
                <Trash2Icon className="h-5 w-5" />
                위험 구역
              </h3>
              <div className="flex flex-wrap gap-3">
                <SignOutButton name={name} />
                <WithDrawButton />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
