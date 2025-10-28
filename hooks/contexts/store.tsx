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
  const [iLikedMarks, setLikedMarks] = useState<number[]>([]);
  const [iReportedMarks, setReportedMarks] = useState<number[]>([]);
  const { data: session } = useSession();

  // useCallback 함수
  // useMemo

  const setMarks = useCallback((likes: number[], reports: number[]) => {
    setLikedMarks(likes);
    setReportedMarks(reports);
  }, []);

  // const toggleLikes = (mark: number) => {
  //   if (iLikedMarks.includes(mark))
  //     setLikedMarks(iLikedMarks.filter((id) => id !== mark));
  //   else setLikedMarks([...iLikedMarks, mark]);
  // };

  // const toggleReports = (mark: number) => {
  //   if (iReportedMarks.includes(mark))
  //     setReportedMarks(iReportedMarks.filter((id) => id !== mark));
  //   else setReportedMarks([...iReportedMarks, mark]);
  // };

  const toggleLikes = (mark: MarkAllColumn) =>
    toggleLikesOrReports(mark, "likes");
  const toggleReports = (mark: MarkAllColumn) =>
    toggleLikesOrReports(mark, "reports");

  const toggleLikesOrReports = async (
    mark: MarkAllColumn,
    type: "likes" | "reports"
  ) => {
    const [state, setState] =
      type === "likes"
        ? [iLikedMarks, setLikedMarks]
        : [iReportedMarks, setReportedMarks];

    const hasNow = state.includes(mark.id);

    await toggleLikesOrReportMark(mark.id, type);

    // count 업데이트를 setState 이전으로 옮긴이유는?
    // store의 상태값이 변경되면, contextapi 아래에있는 컴포넌트는 리렌더링 되기때문(변경된 부분만)
    if (type === "likes") mark._count.Likes += hasNow ? -1 : 1;
    else mark._count.Report += hasNow ? -1 : 1;

    if (hasNow) {
      setState(state.filter((id) => id !== mark.id));
      // mark._count.Likes -= 1;
    } else {
      setState([...state, mark.id]);
      // mark._count.Likes += 1;
    }
  };

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
