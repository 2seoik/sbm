import { ArrowRightIcon, GlobeIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-glow-pulse rounded-full bg-primary/20 blur-3xl" />
          <div
            className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-glow-pulse rounded-full bg-accent/20 blur-3xl"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--border),transparent_70%)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--border),transparent_70%)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <div className="container relative mx-auto px-4 py-20 sm:px-6 md:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div
              className="mb-8 inline-flex animate-fade-in items-center gap-2 rounded-full border border-border/50 bg-secondary/80 px-4 py-2 opacity-0"
              style={{ animationDelay: "0.1s" }}
            >
              <SparklesIcon className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground text-sm">북마크의 새로운 패러다임</span>
            </div>

            {/* Headline */}
            <h1
              className="mb-6 animate-fade-in font-bold font-display text-4xl text-foreground leading-tight opacity-0 sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ animationDelay: "0.2s" }}
            >
              브라우저 속에 갇힌
              <br />
              <span className="gradient-text">인사이트를 해방하라</span>
            </h1>

            {/* Subheadline */}
            <p
              className="mx-auto mb-10 max-w-2xl animate-fade-in text-lg text-muted-foreground leading-relaxed opacity-0 md:text-xl"
              style={{ animationDelay: "0.3s" }}
            >
              개발자를 위한 소셜 북마크 플랫폼.
              <br className="hidden sm:block" />
              엄선한 링크를 공유하고, 관심사가 맞는 사람들과 연결하세요.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex animate-fade-in flex-col items-center justify-center gap-4 opacity-0 sm:flex-row"
              style={{ animationDelay: "0.4s" }}
            >
              <Button variant="hero" size="xl" className="group w-full sm:w-auto">
                무료로 시작하기
                <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                <GlobeIcon className="h-5 w-5" />
                탐색하기
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-16 animate-fade-in opacity-0" style={{ animationDelay: "0.5s" }}>
              <p className="mb-4 text-muted-foreground text-sm">이미 많은 개발자들이 함께하고 있습니다</p>
              <div className="flex items-center justify-center">
                <div className="-space-x-3 flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-secondary font-medium text-muted-foreground text-xs"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="ml-4 text-muted-foreground text-sm">
                  <span className="font-semibold text-foreground">5,000+</span> 사용자
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="-translate-x-1/2 absolute bottom-8 left-1/2 animate-fade-in opacity-0"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-muted-foreground/30 p-2">
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="relative py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 font-bold font-display text-3xl text-foreground md:text-4xl">
              왜 <span className="gradient-text">SBM</span>인가요?
            </h2>
            <p className="text-lg text-muted-foreground">개인의 브라우저에 숨겨진 북마크를 소셜 콘텐츠로 만드세요.</p>
          </div>

          {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <FeatureCard
                          icon={Share2}
                          title="공유 (Share)"
                          description="내가 엄선한 북마크 리스트를 한 클릭으로 공개하세요. 나만의 큐레이션을 세상과 나눌 수 있습니다."
                          gradient="primary"
                        />
                        <FeatureCard
                          icon={Users}
                          title="연결 (Connect)"
                          description="관심사가 비슷한 사람을 팔로우하세요. 주니어 개발자가 시니어의 북마크를 통해 성장할 수 있습니다."
                          gradient="accent"
                        />
                        <FeatureCard
                          icon={GitFork}
                          title="큐레이션 (Curate)"
                          description="남의 공개된 북마크를 Fork해서 나만의 새로운 리스트를 만드세요. 마치 GitHub처럼요."
                          gradient="primary"
                        />
                        <FeatureCard
                          icon={Search}
                          title="발견 (Discover)"
                          description="태그, 카테고리, 트렌드 기반으로 새로운 리소스를 발견하세요. 놓치고 있던 보물을 찾아보세요."
                          gradient="accent"
                        />
                        <FeatureCard
                          icon={Lock}
                          title="프라이버시"
                          description="공개/비공개 설정을 자유롭게 조절하세요. 모든 컬렉션은 기본적으로 비공개입니다."
                          gradient="primary"
                        />
                        <FeatureCard
                          icon={Zap}
                          title="브라우저 확장"
                          description="Chrome, Firefox 확장 프로그램으로 웹 서핑 중 원클릭 저장. 생산성을 극대화하세요."
                          gradient="accent"
                        />
                      </div> */}
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">{/* <StatsSection /> */}</div>
      </section>
      {/* Featured Collections */}
      <section id="explore" className="bg-card/30 py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="mb-2 font-bold font-display text-3xl text-foreground md:text-4xl">인기 컬렉션</h2>
              <p className="text-muted-foreground">커뮤니티에서 가장 사랑받는 큐레이션을 만나보세요.</p>
            </div>
            <Button variant="outline" className="group">
              전체보기
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* {featuredBooks.map((book, index) => (
                          <BookCard key={index} {...book} />
                        ))} */}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 opacity-30">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[600px] w-[600px] rounded-full bg-primary/20 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-bold font-display text-3xl text-foreground md:text-5xl">지금 바로 시작하세요</h2>
            <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
              무료로 가입하고 나만의 북마크 컬렉션을 만들어보세요. 전 세계 개발자들과 인사이트를 공유하세요.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button variant="hero" size="xl" className="group w-full sm:w-auto">
                무료 계정 만들기
                <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
