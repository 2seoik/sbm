import { use } from "react";

type Props = {
  params: Promise<{ nickname: string }>;
};

export default function BookCaseNickname({ params }: Props) {
  const { nickname } = use(params);
  return (
    <div>
      <h1 className="text-3xl">{decodeURI(nickname)}` BookCase</h1>
    </div>
  );
}
