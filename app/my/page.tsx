import { redirect } from "next/navigation";
import { use } from "react";
import ImageUploader from "@/components/image-uploader";
import SignOutButton from "@/components/signout-button";
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
    <div className="container mx-auto grid h-full place-items-center">
      <div className="w-full rounded-md border p-5 text-center shadow-sm">
        <h1 className="mb-5 font-semibold text-2xl">My Page</h1>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-between">
            {/* <Link href="/api/auth/signout">Goto SignOut</Link> */}
            <ImageUploader
              src={image || DummyProfile}
              alt={name}
              changeImage={updateProfileImage}
            />
            {/* <Img src={image || DummyProfile} /> */}
          </div>

          <div className="col-span-2 p-3">
            <ChageProfile user={session.user} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <SignOutButton name={name} />
          <div className="col-span-2 text-right">
            <WithDrawButton />
          </div>
        </div>
      </div>
    </div>
  );
}
