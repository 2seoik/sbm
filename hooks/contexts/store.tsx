"use client";
import { useSession } from "next-auth/react";
import {
  createContext,
  type PropsWithChildren,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  likesAndReports,
  toggleLikesOrReportMark,
} from "@/app/bookcase/[id]/book.action";
import type { MarkAllColumn } from "@/lib/db";

type ContextValueProps = {
  iLikedMarks: number[];
  iReportedMarks: number[];
  toggleLikes: (mark: MarkAllColumn) => void;
  toggleReports: (mark: MarkAllColumn) => void;
  //   setMarks: (likes: number[], reports: number[]) => void;
};

const StoreContext = createContext<ContextValueProps>({
  iLikedMarks: [],
  iReportedMarks: [],
  toggleLikes: () => {},
  toggleReports: () => {},
  //   setMarks: () => {},
});

export function StoreProvider({ children }: PropsWithChildren) {
  const [iLikedMarks, setiLikedMarks] = useState<number[]>([]);
  const [iReportedMarks, setReportedMarks] = useState<number[]>([]);
  const { data: session } = useSession();

  // useCallback 함수
  // useMemo

  const setMarks = useCallback((likes: number[], reports: number[]) => {
    setiLikedMarks(likes);
    setReportedMarks(reports);
  }, []);

  const toggleLikesOrReports = async (
    mark: MarkAllColumn,
    type: "likes" | "reports"
  ) => {
    const [state, setState] =
      type === "likes"
        ? [iLikedMarks, setiLikedMarks]
        : [iReportedMarks, setReportedMarks];

    const hasNow = state.includes(mark.id);

    // 좋아요, 신고 증가
    // TODO : 임시로 bookOwner값을 mark.maker 로 줌
    await toggleLikesOrReportMark(mark.id, type, mark.maker);

    if (type === "likes") mark.Likes.length += hasNow ? -1 : +1;
    else mark.Report.length += hasNow ? -1 : +1;

    if (hasNow) setState(state.filter((id) => id !== mark.id));
    else setState([...state, mark.id]);
  };

  const toggleLikes = (mark: MarkAllColumn) =>
    toggleLikesOrReports(mark, "likes");

  const toggleReports = (mark: MarkAllColumn) =>
    toggleLikesOrReports(mark, "reports");

  useEffect(() => {
    if (session?.user) {
      likesAndReports(Number(session.user.id)).then((res) => {
        // [ [{id:1}, {id: 2} ...]]
        const [likes, reports] = res;
        setMarks(
          likes.map(({ mark }) => mark),
          reports.map(({ mark }) => mark)
        );
      });
    }
  }, [session?.user, setMarks]);

  return (
    <StoreContext.Provider
      value={{ iLikedMarks, iReportedMarks, toggleLikes, toggleReports }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => use(StoreContext);
