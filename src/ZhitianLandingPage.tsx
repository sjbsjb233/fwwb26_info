'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Play,
  RefreshCcw,
  Settings2,
  Sparkles,
  Upload,
  Wand2,
  X,
} from 'lucide-react';

/**
 * 智填助手 Landing Page
 * - TailwindCSS + Framer Motion
 * - 风格参考你的视频：超干净留白、居中主卡片、克制但精致的动效
 *
 * 用法：把这个组件当作页面渲染即可。
 */

const FORM_URL = 'https://fwwb01.sjbsjb.xyz/?key=fwwb2026';
const DESKTOP_URL = 'https://xxxx';

export default function ZhitianLandingPage() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [inAppNoticeOpen, setInAppNoticeOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (v) => {
    setScrolled(v > 30);
  });

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openDisclaimer = () => setDisclaimerOpen(true);

  // 微信/QQ 内置浏览器提示（仅移动端，且只提示一次）
  useEffect(() => {
    try {
      const ua = navigator.userAgent || '';
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
      const isWeChat = /MicroMessenger/i.test(ua);
      const isQQ = /MQQBrowser/i.test(ua) || /QQ\//i.test(ua);
      const key = 'zhitian_inapp_notice_seen_v1';
      if (isMobile && (isWeChat || isQQ) && !localStorage.getItem(key)) {
        setInAppNoticeOpen(true);
      }
    } catch {}
  }, []);

  // 弹窗开启时：锁定滚动 + ESC 关闭（Demo / 提示 / 声明）
  useEffect(() => {
    const open = demoOpen || disclaimerOpen || inAppNoticeOpen;
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (disclaimerOpen) setDisclaimerOpen(false);
      if (inAppNoticeOpen) setInAppNoticeOpen(false);
      if (demoOpen) setDemoOpen(false);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [demoOpen, disclaimerOpen, inAppNoticeOpen]);

  return (
    <div className="relative min-h-screen bg-neutral-50 text-neutral-900">
      {/* 背景：低饱和流动渐变 + 光斑 */}
      <BackgroundOrbs />

      <main className="relative mx-auto max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8">
        {/* 主容器（居中主卡片） */}
        <div className="relative overflow-hidden rounded-[32px] border border-neutral-200/70 bg-white/70 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)] backdrop-blur">
          {/* 顶部轻导航（scroll后缩小+sticky） */}
          <TopNav
            scrolled={scrolled}
            onNav={scrollTo}
            onPrimary={openDisclaimer}
            onLogin={openDisclaimer}
            onDemo={() => setDemoOpen(true)}
          />

          {/* 内容区 */}
          <div className="px-6 pb-14 pt-8 sm:px-10 sm:pt-10">
            <Hero onPrimary={openDisclaimer} onDemo={() => setDemoOpen(true)} />

            <div className="mt-14 sm:mt-20" id="capabilities">
              <SectionTitle
                eyebrow="能力"
                title="一屏讲一件事，越看越清楚"
                desc="多格式输入 → 自动抽取理解 → 填充 Word/Excel 模板 → 导出可交付成果"
              />
              <Capabilities />
            </div>

            <div className="mt-16 sm:mt-24" id="steps">
              <SectionTitle
                eyebrow="核心流程"
                title="4 步，把散乱资料变成可交付文件"
                desc="你只管上传资料和模板；其余的理解、匹配、填充、导出交给智填助手。"
              />
              <InteractiveSteps />
            </div>

            <div className="mt-16 sm:mt-24" id="results">
              <SectionTitle
                eyebrow="结果展示"
                title="看得见的输出，才叫效率"
                desc="示意预览可替换为你们真实的 Word/Excel 截图。"
              />
              <ResultsShowcase />
            </div>

            <div className="mt-16 sm:mt-24" id="cta">
              <CTA onPrimary={openDisclaimer} />
            </div>

            <Footer />
          </div>
        </div>
      </main>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      <InAppNoticeModal
        open={inAppNoticeOpen}
        url={DESKTOP_URL}
        onAcknowledge={() => {
          try {
            localStorage.setItem('zhitian_inapp_notice_seen_v1', '1');
          } catch {}
          setInAppNoticeOpen(false);
        }}
      />

      <DisclaimerModal
        open={disclaimerOpen}
        onClose={() => setDisclaimerOpen(false)}
        onAgree={() => {
          setDisclaimerOpen(false);
          window.location.href = FORM_URL;
        }}
      />

      {/* 关键帧 & 小特效 */}
      <GlobalStyles />
    </div>
  );
}

function TopNav({
  scrolled,
  onNav,
  onPrimary,
  onLogin,
  onDemo,
}: {
  scrolled: boolean;
  onNav: (id: string) => void;
  onPrimary: () => void;
  onLogin: () => void;
  onDemo: () => void;
}) {
  return (
    <motion.header
      layout
      className={
        "sticky top-0 z-40 border-b border-neutral-200/60 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/50"
      }
      style={{
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
      }}
    >
      <motion.div
        layout
        className={
          "mx-auto flex items-center justify-between gap-3 px-6 sm:px-10 " +
          (scrolled ? 'py-3' : 'py-5')
        }
      >
        <button
          onClick={() => onNav('top')}
          className="group flex items-center gap-3 rounded-full px-2 py-1 text-left outline-none transition hover:bg-neutral-100/70"
          aria-label="返回顶部"
        >
          <div className="relative grid h-9 w-9 place-items-center rounded-full border border-neutral-200 bg-white shadow-sm">
            <img
              src="https://files.seeusercontent.com/2026/02/17/y7Bz/58787586.png"
              alt="智填助手 Logo"
              className="h-6 w-6 object-contain"
              loading="lazy"
            />
            <span className="pointer-events-none absolute -inset-3 opacity-0 blur-xl transition group-hover:opacity-60 bg-[radial-gradient(circle_at_center,rgba(255,212,75,0.55),transparent_60%)]" />
          </div>
          <div className="leading-tight">
            <div className={"font-semibold tracking-tight " + (scrolled ? 'text-[15px]' : 'text-[16px]')}>
              智填助手
            </div>
            <div className="hidden text-xs text-neutral-500 sm:block">让模板自动被填好</div>
          </div>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            { label: '指南', id: 'steps' },
            { label: '能力', id: 'capabilities' },
            { label: '结果', id: 'results' },
          ].map((it) => (
            <button
              key={it.id}
              onClick={() => onNav(it.id)}
              className="rounded-full px-3 py-2 text-sm text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
            >
              {it.label}
            </button>
          ))}

          <button
            onClick={onDemo}
            className="ml-1 rounded-full px-3 py-2 text-sm text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            观看演示
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onLogin}
            className="hidden rounded-full px-3 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100 md:inline-flex"
          >
            登录
          </button>
          <PillButton onClick={onPrimary}>
            开始使用 <ArrowRight className="ml-2 h-4 w-4" />
          </PillButton>
        </div>
      </motion.div>
    </motion.header>
  );
}

function Hero({ onPrimary, onDemo }: { onPrimary: () => void; onDemo: () => void }) {
  return (
    <section id="top" className="relative">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3 py-1 text-sm text-neutral-600"
          >
            <Sparkles className="h-4 w-4" />
            支持 docx / md / txt / xlsx → 自动抽取 → 填充模板 → 导出
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-[42px] font-semibold leading-[1.08] tracking-tight sm:text-[56px]"
          >
            把散乱文档，
            <br />
            <span className="relative inline-block">
              <MarkerHighlight>一键</MarkerHighlight>
            </span>
            变成
            <span className="relative inline-block">
              <MarkerHighlight>可交付</MarkerHighlight>
            </span>
            的表格与文档
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg"
          >
            上传资料与模板后，系统会理解内容、匹配字段、自动填入 Word/Excel 模板；导出文件可直接提交。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <PillButton onClick={onPrimary}>
              开始填表 <ArrowRight className="ml-2 h-4 w-4" />
            </PillButton>
            <GhostButton onClick={onDemo}>
              <Play className="mr-2 h-4 w-4" /> 观看 30 秒演示
            </GhostButton>
          </motion.div>

          {/* 小承诺点 */}
          <motion.ul
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 grid max-w-xl grid-cols-1 gap-3 text-sm text-neutral-600 sm:grid-cols-2"
          >
            {[
              '字段可追踪：失败原因、可重试',
              '模板直出：保留原版式',
              '多资料混输：自动去重对齐',
              '可接口对接 / 私有化部署',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-neutral-200 bg-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span>{t}</span>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* 右侧：业务相关“流程动效胶囊” + 文件 chips */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <TiltCard className="relative overflow-hidden rounded-[28px] border border-neutral-200 bg-white/70 p-6 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-neutral-700">上传 → 理解 → 匹配 → 导出</div>
                <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  运行中
                </span>
              </div>

              <div className="mt-5">
                <FlowCapsule />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <MiniStat icon={<FileText className="h-4 w-4" />} label="文档理解" value="抽取 36 字段" />
                <MiniStat icon={<FileSpreadsheet className="h-4 w-4" />} label="模板填充" value="保留原版式" />
                <MiniStat icon={<RefreshCcw className="h-4 w-4" />} label="可重试" value="失败可回溯" />
              </div>

              {/* 光斑与纹理 */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,214,102,0.38),transparent_62%)] blur-2xl" />
              <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.22),transparent_62%)] blur-2xl" />
              <div className="noise pointer-events-none absolute inset-0 opacity-[0.06]" />
            </TiltCard>

            {/* 漂浮 chips（参考视频那种“标签卡片”） */}
            <div className="hidden sm:block">
              <FloatingChips />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20% 0px -10% 0px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-600"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
        {eyebrow}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20% 0px -10% 0px' }}
        transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20% 0px -10% 0px' }}
        transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base"
      >
        {desc}
      </motion.p>
    </div>
  );
}

function Capabilities() {
  const cards = useMemo(
    () => [
      {
        tab: '自动理解',
        color: 'bg-lime-200',
        icon: <Wand2 className="h-5 w-5" />,
        title: '多文档、多格式混合输入',
        desc: '支持 docx / md / txt / xlsx；自动抽取实体与字段，去重对齐，统一成结构化结果。',
      },
      {
        tab: '模板填充',
        color: 'bg-violet-200',
        icon: <FileSpreadsheet className="h-5 w-5" />,
        title: 'Word/Excel 模板直接输出',
        desc: '保留你模板的版式、公式与合并单元格；字段映射可复用，越用越省事。',
      },
      {
        tab: '可追踪',
        color: 'bg-sky-200',
        icon: <RefreshCcw className="h-5 w-5" />,
        title: '状态、失败原因、可重试',
        desc: '每一步可回溯：解析/匹配/填充/导出；失败给出原因与建议，一键重试。',
      },
    ],
    []
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((c, i) => (
        <motion.div
          key={c.tab}
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-18% 0px -8% 0px' }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <TiltCard className="relative h-full overflow-hidden rounded-[22px] border border-neutral-200 bg-white/70 p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700">
                <span className={"h-2.5 w-2.5 rounded-full " + c.color} />
                {c.tab}
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm">
                {c.icon}
              </div>
            </div>
            <div className="text-lg font-semibold tracking-tight">{c.title}</div>
            <div className="mt-2 text-sm leading-relaxed text-neutral-600">{c.desc}</div>

            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06),transparent_60%)] blur-2xl" />
            <div className="noise pointer-events-none absolute inset-0 opacity-[0.05]" />
          </TiltCard>
        </motion.div>
      ))}
    </div>
  );
}

function InteractiveSteps() {
  const steps = useMemo(
    () => [
      {
        key: 'upload-source',
        title: '上传资料',
        icon: <Upload className="h-4 w-4" />,
        desc: '把散落的文档、邮件导出、聊天记录、表格一次性丢进来。',
        right: <StepPreviewUpload />,
      },
      {
        key: 'upload-template',
        title: '上传模板',
        icon: <FileText className="h-4 w-4" />,
        desc: '支持 Word / Excel 模板，保持你原有格式与版式。',
        right: <StepPreviewTemplate />,
      },
      {
        key: 'advanced',
        title: '高级设置（可选）',
        icon: <Settings2 className="h-4 w-4" />,
        desc: '字段映射、抽取范围、校验规则、缺失字段处理策略。',
        right: <StepPreviewAdvanced />,
      },
      {
        key: 'export',
        title: '输出结果',
        icon: <Download className="h-4 w-4" />,
        desc: '一键导出，预览、下载、分享；失败可追踪原因并重试。',
        right: <StepPreviewExport />,
      },
    ],
    []
  );

  const [active, setActive] = useState(steps[0].key);

  const activeStep = steps.find((s) => s.key === active) ?? steps[0];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div className="space-y-3">
          {steps.map((s, idx) => {
            const isActive = s.key === active;
            return (
              <motion.button
                key={s.key}
                onClick={() => setActive(s.key)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                className={
                  "group relative w-full rounded-[18px] border p-4 text-left transition " +
                  (isActive
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-[0_18px_45px_-30px_rgba(0,0,0,0.55)]'
                    : 'border-neutral-200 bg-white/70 text-neutral-900 hover:bg-white')
                }
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        "grid h-8 w-8 place-items-center rounded-full border " +
                        (isActive ? 'border-white/15 bg-white/10' : 'border-neutral-200 bg-white')
                      }
                    >
                      {s.icon}
                    </span>
                    <div>
                      <div className="text-sm font-semibold tracking-tight">{s.title}</div>
                      <div className={"mt-1 text-sm leading-snug " + (isActive ? 'text-white/75' : 'text-neutral-600')}>
                        {s.desc}
                      </div>
                    </div>
                  </div>
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2 py-1 text-xs " +
                      (isActive ? 'bg-white/10 text-white/80' : 'bg-neutral-100 text-neutral-600')
                    }
                  >
                    Step {idx + 1}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-5 rounded-[18px] border border-neutral-200 bg-white/70 p-4 text-sm text-neutral-600">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-neutral-200 bg-white">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <p className="leading-relaxed">
              建议把“演示用模板”和“演示用资料”准备成一套，用户点一次就能看到从上传到导出的完整链路。
            </p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7">
        <TiltCard className="relative overflow-hidden rounded-[22px] border border-neutral-200 bg-white/70 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold tracking-tight">{activeStep.title}</div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              实时预览
            </div>
          </div>

          <div className="mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {activeStep.right}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05),transparent_62%)] blur-2xl" />
          <div className="noise pointer-events-none absolute inset-0 opacity-[0.05]" />
        </TiltCard>
      </div>
    </div>
  );
}

function ResultsShowcase() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-18% 0px -8% 0px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <TiltCard className="relative overflow-hidden rounded-[22px] border border-neutral-200 bg-white/70 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 bg-white shadow-sm">
                <FileSpreadsheet className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold">Excel 输出预览</div>
                <div className="text-xs text-neutral-500">字段已映射 & 公式保留</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">
              <Eye className="h-4 w-4" />
              预览
            </span>
          </div>

          <div className="mt-4">
            <FakeExcel />
          </div>

          <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.18),transparent_62%)] blur-2xl" />
          <div className="noise pointer-events-none absolute inset-0 opacity-[0.05]" />
        </TiltCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-18% 0px -8% 0px' }}
        transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      >
        <TiltCard className="relative overflow-hidden rounded-[22px] border border-neutral-200 bg-white/70 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 bg-white shadow-sm">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold">Word 输出预览</div>
                <div className="text-xs text-neutral-500">版式、段落、表格样式保留</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">
              <Download className="h-4 w-4" />
              下载
            </span>
          </div>

          <div className="mt-4">
            <FakeWord />
          </div>

          <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18),transparent_62%)] blur-2xl" />
          <div className="noise pointer-events-none absolute inset-0 opacity-[0.05]" />
        </TiltCard>
      </motion.div>
    </div>
  );
}

function CTA({ onPrimary }: { onPrimary: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-18% 0px -8% 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[26px] border border-neutral-200 bg-white/70 p-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.5)]"
    >
      <div className="max-w-3xl">
        <div className="text-3xl font-semibold tracking-tight sm:text-4xl">
          准备好把文档变成
          <span className="relative inline-block">
            <MarkerHighlight>可交付成果</MarkerHighlight>
          </span>
          了吗？
        </div>
        <div className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
          支持私有化 / 接口对接。上线后，你可以把“字段映射”沉淀成团队资产。
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <PillButton onClick={onPrimary}>
            开始填表 <ArrowRight className="ml-2 h-4 w-4" />
          </PillButton>
          <GhostButton onClick={() => alert('这里可跳转到：联系销售 / 申请试用 / 私有化方案页面')}>联系 / 方案</GhostButton>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,214,102,0.28),transparent_55%),radial-gradient(circle_at_70%_35%,rgba(99,102,241,0.18),transparent_55%),radial-gradient(circle_at_40%_85%,rgba(16,185,129,0.14),transparent_60%)]" />
      <div className="noise pointer-events-none absolute inset-0 opacity-[0.06]" />
    </motion.div>
  );
}

function Footer() {
  return (
    <div className="mt-10 border-t border-neutral-200/70 pt-6 text-sm text-neutral-500">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>© {new Date().getFullYear()} 智填助手 · 文档到模板的自动化填充平台</div>
        <div className="flex items-center gap-2">
          <a className="rounded-full px-3 py-1.5 hover:bg-neutral-100" href="#" onClick={(e) => e.preventDefault()}>
            隐私
          </a>
          <a className="rounded-full px-3 py-1.5 hover:bg-neutral-100" href="#" onClick={(e) => e.preventDefault()}>
            条款
          </a>
          <a className="rounded-full px-3 py-1.5 hover:bg-neutral-100" href="#" onClick={(e) => e.preventDefault()}>
            支持
          </a>
        </div>
      </div>
    </div>
  );
}

/** ---------------------- 右侧动效/组件 ---------------------- */

function FlowCapsule() {
  const steps = ['上传资料', '解析抽取', '匹配字段', '生成文件'];
  return (
    <div className="relative rounded-[18px] border border-neutral-200 bg-white/70 p-4">
      <div className="relative flex items-center justify-between gap-2">
        {steps.map((s, i) => (
          <div key={s} className="relative flex flex-1 flex-col items-center gap-2">
            <div className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-neutral-200 bg-white shadow-sm">
              <span className="relative z-10 text-sm font-semibold">{i + 1}</span>
              <span className="pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06),transparent_60%)] opacity-0 blur-xl transition group-hover:opacity-100" />
            </div>
            <div className="text-xs font-medium text-neutral-700">{s}</div>
          </div>
        ))}

        {/* 流动线条 */}
        <div className="pointer-events-none absolute left-6 right-6 top-5 z-0 h-[2px] overflow-hidden rounded-full bg-neutral-200">
          <div className="h-full w-[40%] animate-flow rounded-full bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.35),transparent)]" />
        </div>
      </div>

      {/* 文件 chips（漂浮 -> 吸附感） */}
      <div className="relative mt-4 h-12">
        {[
          { t: 'docx', x: '8%', d: 0 },
          { t: 'md', x: '30%', d: 0.12 },
          { t: 'xlsx', x: '54%', d: 0.2 },
          { t: 'txt', x: '76%', d: 0.28 },
        ].map((c) => (
          <motion.div
            key={c.t}
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: c.x }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.6, delay: c.d, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm">
              {c.t}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FloatingChips() {
  const chips = [
    { label: 'docx', icon: '📝', className: 'bg-lime-200/80', r: -6, x: '-10%', y: '10%', d: 0.1 },
    { label: 'xlsx', icon: '📊', className: 'bg-sky-200/80', r: 4, x: '5%', y: '-2%', d: 0.2 },
    { label: '字段映射', icon: '🧭', className: 'bg-violet-200/80', r: 10, x: '52%', y: '6%', d: 0.28 },
    { label: '导出', icon: '⬇️', className: 'bg-amber-200/80', r: -10, x: '66%', y: '72%', d: 0.35 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0">
      {chips.map((c) => (
        <motion.div
          key={c.label}
          className="absolute"
          style={{ left: c.x, top: c.y, rotate: c.r }}
          animate={{ y: [0, -10, 0], rotate: [c.r, c.r + 1.2, c.r] }}
          transition={{ duration: 3.6, delay: c.d, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            className={
              "inline-flex items-center gap-2 rounded-[14px] border border-neutral-200 bg-white px-3 py-2 text-sm shadow-[0_18px_35px_-28px_rgba(0,0,0,0.55)] " +
              c.className
            }
          >
            <span className="text-base">{c.icon}</span>
            <span className="font-medium text-neutral-800">{c.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[16px] border border-neutral-200 bg-white/70 p-3">
      <div className="flex items-center gap-2 text-neutral-700">
        <span className="grid h-8 w-8 place-items-center rounded-full border border-neutral-200 bg-white shadow-sm">
          {icon}
        </span>
        <div className="min-w-0">
          <div className="text-xs font-medium text-neutral-500">{label}</div>
          <div className="truncate text-sm font-semibold">{value}</div>
        </div>
      </div>
    </div>
  );
}

/** ---------------------- Step 预览 ---------------------- */

function StepPreviewUpload() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-[18px] border border-neutral-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">资料区</div>
          <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">拖拽上传</span>
        </div>
        <div className="mt-3 space-y-2">
          {[
            { t: '项目需求说明.docx', tag: 'docx' },
            { t: '会议纪要.md', tag: 'md' },
            { t: '客户清单.xlsx', tag: 'xlsx' },
            { t: '补充信息.txt', tag: 'txt' },
          ].map((f, i) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-between rounded-[14px] border border-neutral-200 bg-neutral-50 px-3 py-2"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{f.t}</div>
                <div className="text-xs text-neutral-500">已加入队列</div>
              </div>
              <span className="rounded-full border border-neutral-200 bg-white px-2 py-1 text-xs font-medium text-neutral-700">
                {f.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-[18px] border border-neutral-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">抽取预览</div>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">识别中</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            ['客户名称', '海风科技'],
            ['合同编号', 'HF-2026-0521'],
            ['起止日期', '2026/05/01 - 2027/04/30'],
            ['金额', '¥ 2,480,000'],
            ['交付物', '验收报告 / 清单'],
            ['负责人', '张某某'],
          ].map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i + 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[14px] border border-neutral-200 bg-neutral-50 p-3"
            >
              <div className="text-xs font-medium text-neutral-500">{k}</div>
              <div className="mt-1 truncate text-sm font-semibold text-neutral-800">{v}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepPreviewTemplate() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-[18px] border border-neutral-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">模板区</div>
          <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">可复用</span>
        </div>
        <div className="mt-3 space-y-2">
          {[
            { t: '交付验收报告模板.docx', icon: <FileText className="h-4 w-4" /> },
            { t: '项目台账模板.xlsx', icon: <FileSpreadsheet className="h-4 w-4" /> },
          ].map((f, i) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-between rounded-[14px] border border-neutral-200 bg-neutral-50 px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-neutral-200 bg-white">
                  {f.icon}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{f.t}</div>
                  <div className="text-xs text-neutral-500">已读取结构</div>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">OK</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-[18px] border border-neutral-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">字段映射</div>
          <span className="rounded-full bg-violet-50 px-2 py-1 text-xs text-violet-700">自动建议</span>
        </div>
        <div className="mt-3 space-y-2">
          {[
            ['客户名称', '客户名称'],
            ['合同编号', '合同编号'],
            ['金额', '总金额'],
            ['起止日期', '服务周期'],
          ].map(([a, b], i) => (
            <motion.div
              key={a}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i + 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-between rounded-[14px] border border-neutral-200 bg-neutral-50 px-3 py-2"
            >
              <span className="text-sm font-medium">{a}</span>
              <span className="text-xs text-neutral-500">→</span>
              <span className="text-sm font-semibold text-neutral-800">{b}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepPreviewAdvanced() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-[18px] border border-neutral-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">抽取范围</div>
          <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">默认推荐</span>
        </div>
        <div className="mt-3 space-y-2">
          {[
            { k: '只抽取“项目资料”文件夹', v: '开启' },
            { k: '金额字段校验（数值/币种）', v: '开启' },
            { k: '缺失字段处理', v: '标记为待补充' },
            { k: '同字段冲突', v: '优先最新时间' },
          ].map((r, i) => (
            <motion.div
              key={r.k}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-between rounded-[14px] border border-neutral-200 bg-neutral-50 px-3 py-2"
            >
              <span className="text-sm font-medium">{r.k}</span>
              <span className="rounded-full border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-700">{r.v}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-[18px] border border-neutral-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">字段校验报告</div>
          <span className="rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700">2 项提示</span>
        </div>
        <div className="mt-3 space-y-2">
          {[
            { k: '负责人', v: '疑似缺失（模板必填）' },
            { k: '起止日期', v: '格式建议：YYYY/MM/DD' },
          ].map((r, i) => (
            <motion.div
              key={r.k}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[14px] border border-neutral-200 bg-neutral-50 px-3 py-2"
            >
              <div className="text-sm font-semibold">{r.k}</div>
              <div className="mt-1 text-xs text-neutral-600">{r.v}</div>
            </motion.div>
          ))}

          <div className="mt-2 rounded-[14px] border border-neutral-200 bg-white p-3 text-xs text-neutral-600">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-neutral-200 bg-white">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span>提示：高级设置默认折叠，让“炫酷”但不打扰主流程。</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepPreviewExport() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-[18px] border border-neutral-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">导出队列</div>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">完成</span>
        </div>
        <div className="mt-3 space-y-2">
          {[
            { t: '交付验收报告_海风科技.docx', s: '可下载' },
            { t: '项目台账_海风科技.xlsx', s: '可下载' },
          ].map((f, i) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-between rounded-[14px] border border-neutral-200 bg-neutral-50 px-3 py-2"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{f.t}</div>
                <div className="text-xs text-neutral-500">{f.s}</div>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white shadow-sm transition hover:translate-y-[-1px]"
                onClick={() => alert('这里可触发真实下载')}
              >
                <Download className="h-4 w-4" />
                下载
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-[18px] border border-neutral-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">可追踪</div>
          <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">可重试</span>
        </div>
        <div className="mt-3 space-y-2">
          {[
            { k: '解析抽取', v: '36 字段 / 4 文件' },
            { k: '字段匹配', v: '92% 自动匹配' },
            { k: '缺失字段', v: '2 项标记待补充' },
            { k: '导出', v: '2 文件已生成' },
          ].map((r, i) => (
            <motion.div
              key={r.k}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i + 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-between rounded-[14px] border border-neutral-200 bg-neutral-50 px-3 py-2"
            >
              <div className="text-sm font-medium">{r.k}</div>
              <div className="text-xs text-neutral-600">{r.v}</div>
            </motion.div>
          ))}
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <button
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-[14px] border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
              onClick={() => alert('这里可打开日志/详情')}
            >
              <Eye className="h-4 w-4" />
              查看详情
            </button>
            <button
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-[14px] bg-neutral-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:translate-y-[-1px]"
              onClick={() => alert('这里可触发重试')}
            >
              <RefreshCcw className="h-4 w-4" />
              一键重试
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** ---------------------- 结果预览（占位） ---------------------- */

function FakeExcel() {
  const cols = 8;
  const rows = 10;

  return (
    <div className="relative no-scrollbar overflow-x-auto overflow-y-hidden rounded-[16px] border border-neutral-200 bg-white sm:overflow-hidden">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
        <span className="font-medium">项目台账.xlsx</span>
        <span className="rounded-full border border-neutral-200 bg-white px-2 py-1">已填充</span>
      </div>

      <div className="grid min-w-[760px] sm:min-w-0" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: cols * rows }).map((_, i) => (
          <div
            key={i}
            className="h-8 border-b border-r border-neutral-100 px-2 py-1 text-[11px] text-neutral-600"
          >
            {i % cols === 1 && i < cols * 3 ? ['客户名称', '合同编号', '金额'][Math.floor(i / cols)] : ''}
            {i % cols === 3 && i < cols * 3 ? ['海风科技', 'HF-2026-0521', '¥ 2,480,000'][Math.floor(i / cols)] : ''}
          </div>
        ))}
      </div>

      {/* 轻微 shimmer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="shimmer absolute -left-1/2 top-0 h-full w-1/2 bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.05),transparent)]" />
      </div>
    </div>
  );
}

function FakeWord() {
  return (
    <div className="relative overflow-hidden rounded-[16px] border border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
        <span className="font-medium">交付验收报告.docx</span>
        <span className="rounded-full border border-neutral-200 bg-white px-2 py-1">已生成</span>
      </div>

      <div className="p-4">
        <div className="text-sm font-semibold">项目交付验收报告</div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-neutral-600">
          <div className="rounded-[12px] border border-neutral-200 bg-neutral-50 p-2">
            <div className="font-medium text-neutral-500">客户</div>
            <div className="mt-1 font-semibold text-neutral-800">海风科技</div>
          </div>
          <div className="rounded-[12px] border border-neutral-200 bg-neutral-50 p-2">
            <div className="font-medium text-neutral-500">合同编号</div>
            <div className="mt-1 font-semibold text-neutral-800">HF-2026-0521</div>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={
                'h-2 rounded-full bg-neutral-100 ' +
                (i === 0 ? 'w-11/12' : i === 1 ? 'w-10/12' : i === 2 ? 'w-9/12' : i === 3 ? 'w-8/12' : 'w-10/12')
              }
            />
          ))}
        </div>

        <div className="mt-4 rounded-[14px] border border-neutral-200 bg-neutral-50 p-3">
          <div className="text-xs font-semibold text-neutral-700">交付清单</div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-neutral-600">
            {['需求确认', '开发完成', '联调通过', '文档齐全', '验收通过', '归档'].map((t) => (
              <div key={t} className="rounded-[12px] border border-neutral-200 bg-white px-2 py-1">
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="shimmer absolute -left-1/2 top-0 h-full w-1/2 bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.05),transparent)]" />
      </div>
    </div>
  );
}

/** ---------------------- Demo Modal ---------------------- */

function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-3xl overflow-hidden rounded-[22px] border border-white/15 bg-neutral-950 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="text-sm font-semibold text-white">30 秒演示</div>
              <button
                onClick={onClose}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10"
              >
                关闭
              </button>
            </div>

            {/*
              这里放你们自己的演示视频：
              - Next.js / Vite：把 mp4 放到 public/demo.mp4，然后 src="/demo.mp4"
              - 或者替换成 iframe / 图片序列
            */}
            <div className="aspect-video bg-black">
              <video
                className="h-full w-full"
                controls
                playsInline
                preload="metadata"
                src="/demo.mp4"
              />
            </div>

            <div className="px-4 py-3 text-xs text-white/60">
              提示：把“上传资料 → 模板 → 导出”的完整链路录成一段，配合这里的弹窗效果非常加分。
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** ---------------------- 免责声明 / 内置浏览器提示 ---------------------- */

function InAppNoticeModal({
  open,
  url,
  onAcknowledge,
}: {
  open: boolean;
  url: string;
  onAcknowledge: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[55] grid place-items-center bg-black/45 p-4"
          onClick={onAcknowledge}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-[22px] border border-neutral-200 bg-white/90 shadow-2xl backdrop-blur"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200/70 px-5 py-4">
              <div className="text-base font-semibold tracking-tight text-neutral-900">提示</div>
              <button
                onClick={onAcknowledge}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-50"
                aria-label="关闭"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 py-4">
              <div className="whitespace-pre-line text-sm leading-relaxed text-neutral-700">
                {`检测到你正在使用微信/QQ 内置浏览器浏览。
部分动效/渲染在内置浏览器中可能出现显示异常。

建议使用电脑访问本网页：`}
              </div>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block break-all rounded-[14px] border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
              >
                {url}
              </a>
            </div>

            <div className="border-t border-neutral-200/70 px-5 py-4">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                onClick={onAcknowledge}
                className="inline-flex w-full items-center justify-center rounded-[14px] bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_-18px_rgba(0,0,0,0.8)]"
              >
                已知晓
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function DisclaimerModal({
  open,
  onClose,
  onAgree,
}: {
  open: boolean;
  onClose: () => void;
  onAgree: () => void;
}) {
  // 赛方 Logo（外链）：按你的要求，不使用 base64
  const LOGO_URL = 'https://files.seeusercontent.com/2026/02/17/qu8D/28473652395.png';

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] grid place-items-center bg-black/55 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-[24px] border border-neutral-200 bg-white/92 shadow-2xl backdrop-blur"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 轻微流光装饰（克制但更“可视化”） */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18),transparent_62%)] blur-2xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.14),transparent_62%)] blur-2xl" />

            {/* Header：品牌区 + 关闭 */}
            <div className="relative px-5 pt-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-[14px] border border-neutral-200 bg-white shadow-sm">
                      <img src={LOGO_URL} alt="服务外包比赛 Logo" className="h-9 w-9 object-contain" />
                    </div>
                    <div className="pointer-events-none absolute -inset-4 -z-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,214,102,0.35),transparent_60%)] blur-xl" />
                  </div>

                  <div className="leading-tight">
                    <div className="text-xs font-medium text-neutral-500">服务外包比赛 · 展示与评审</div>
                    <div className="mt-1 text-[17px] font-semibold tracking-tight text-neutral-900">声明</div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-50"
                  aria-label="不同意并关闭"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* 渐变强调条 */}
              <div className="mt-4 h-[6px] w-full rounded-full bg-[linear-gradient(90deg,rgba(99,102,241,0.9),rgba(16,185,129,0.85),rgba(251,191,36,0.85))]" />
            </div>

            {/* 内容区 */}
            <div className="px-5 pb-5 pt-4">
              {/* 可视化重点卡片 */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: <Sparkles className="h-4 w-4" />,
                    title: '阶段性演示',
                    desc: '当前为比赛评审展示版本',
                    tone: 'bg-violet-50 text-violet-700 border-violet-200/70',
                  },
                  {
                    icon: <Eye className="h-4 w-4" />,
                    title: '效果可能不同',
                    desc: '功能/性能/呈现存在差异',
                    tone: 'bg-amber-50 text-amber-700 border-amber-200/70',
                  },
                  {
                    icon: <FileText className="h-4 w-4" />,
                    title: '以最终为准',
                    desc: '详见项目文档/最终发布',
                    tone: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    className={
                      'rounded-[16px] border px-4 py-3 shadow-[0_10px_26px_-22px_rgba(0,0,0,0.35)] ' + c.tone
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-[12px] bg-white/70 ring-1 ring-black/5">
                        {c.icon}
                      </span>
                      <div className="text-sm font-semibold tracking-tight">{c.title}</div>
                    </div>
                    <div className="mt-2 text-xs leading-relaxed opacity-90">{c.desc}</div>
                  </div>
                ))}
              </div>

              {/* 正文（更舒服的排版 + 可滚动容器） */}
              <div className="mt-4 rounded-[18px] border border-neutral-200 bg-neutral-50/70 p-4">
                <div className="max-h-[42vh] overflow-auto pr-1">
                  <div className="whitespace-pre-line text-sm leading-relaxed text-neutral-700">
                    {`为配合服务外包比赛的展示与评审需求，本项目当前提供阶段性演示版本。
由于开发进度与演示环境限制，系统在功能完备性、性能表现、视觉呈现及数据准确性方面仍可能存在差异，因此本版本的呈现不构成最终产品效果承诺。

如需了解最终规划与完整方案，请参考项目文档或最终发布版本。`}
                  </div>
                </div>
              </div>

              {/* 底部操作 */}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="inline-flex h-5 items-center gap-1 rounded-full border border-neutral-200 bg-white px-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    提示
                  </span>
                  继续即表示你已阅读并同意上述内容
                </div>

                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  onClick={onAgree}
                  className="inline-flex w-full items-center justify-center rounded-[14px] bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_-18px_rgba(0,0,0,0.8)] sm:w-auto"
                >
                  已阅读并同意 <ArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
              </div>
            </div>

            <div className="noise pointer-events-none absolute inset-0 opacity-[0.04]" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** ---------------------- 视觉组件 ---------------------- */

function BackgroundOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="orb absolute -left-24 -top-28 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,214,102,0.38),transparent_60%)] blur-3xl" />
      <div className="orb2 absolute -right-24 top-24 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.22),transparent_62%)] blur-3xl" />
      <div className="orb3 absolute left-1/4 top-[55%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.14),transparent_62%)] blur-3xl" />
      <div className="noise absolute inset-0 opacity-[0.05]" />
    </div>
  );
}

function MarkerHighlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block px-1">
      <span className="relative z-10">{children}</span>

      {/* 荧光笔底色 */}
      <motion.span
        className="absolute inset-x-0 bottom-[0.18em] z-0 h-[0.62em] -rotate-1 rounded-[10px] bg-[linear-gradient(90deg,rgba(163,230,53,0.55),rgba(99,102,241,0.35),rgba(251,191,36,0.35))]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'left' }}
      />

      {/* 手绘描边（SVG path） */}
      <svg
        className="absolute inset-x-0 bottom-[0.05em] z-0 h-[0.9em] w-full"
        viewBox="0 0 100 24"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d="M4 18 C 20 22, 40 22, 58 18 S 86 14, 96 18"
          fill="none"
          stroke="rgba(0,0,0,0.45)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </span>
  );
}

function PillButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 320, damping: 20 }}
      className="inline-flex items-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-[0_12px_30px_-18px_rgba(0,0,0,0.8)] outline-none"
    >
      {children}
    </motion.button>
  );
}

function GhostButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className="inline-flex items-center rounded-full border border-neutral-200 bg-white/70 px-4 py-2 text-sm font-medium text-neutral-900 shadow-sm outline-none hover:bg-white"
    >
      {children}
    </motion.button>
  );
}

function TiltCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rotY = (px - 0.5) * 10;
    const rotX = (0.5 - py) * 10;
    setStyle({
      transform: `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`,
    });
  };

  const onLeave = () => {
    setStyle({ transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)' });
  };

  return (
    <div
      ref={ref}
      className={
        'transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:shadow-[0_18px_55px_-40px_rgba(0,0,0,0.55)] ' +
        (className ?? '')
      }
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}

function GlobalStyles() {
  return (
    <style jsx global>{`
      .noise {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
      }
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        scrollbar-width: none;
      }

      @keyframes flow {
        0% {
          transform: translateX(-40%);
          opacity: 0.15;
        }
        50% {
          opacity: 0.5;
        }
        100% {
          transform: translateX(240%);
          opacity: 0.15;
        }
      }
      .animate-flow {
        animation: flow 2.4s ease-in-out infinite;
      }
      @keyframes shimmer {
        0% {
          transform: translateX(-50%);
          opacity: 0.0;
        }
        20% {
          opacity: 0.35;
        }
        50% {
          opacity: 0.18;
        }
        100% {
          transform: translateX(250%);
          opacity: 0.0;
        }
      }
      .shimmer {
        animation: shimmer 2.8s ease-in-out infinite;
      }
      @keyframes orb {
        0% {
          transform: translate3d(0, 0, 0) scale(1);
        }
        50% {
          transform: translate3d(18px, -10px, 0) scale(1.03);
        }
        100% {
          transform: translate3d(0, 0, 0) scale(1);
        }
      }
      .orb {
        animation: orb 12s ease-in-out infinite;
      }
      .orb2 {
        animation: orb 14s ease-in-out infinite;
      }
      .orb3 {
        animation: orb 16s ease-in-out infinite;
      }
    `}</style>
  );
}
