import type { ActionFunctionArgs, MetaFunction } from "react-router";
import { useFetcher } from "react-router";
import * as React from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import { useHabitStore, type HabitType } from "stores/habits";
import { HelpTooltip } from "~/components/help-tooltip";

type ChatRole = "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

type HabitSuggestion = {
  title: string;
  type: HabitType;
  trigger: string;
  action: string;
  reward: string;
  why: string;
  goalDays?: number;
};

type ActionResponse = {
  reply: string;
  habits: HabitSuggestion[];
};

export const meta: MetaFunction = () => [
  { title: "ИИ‑психолог — привычки из чата" },
  {
    name: "description",
    content:
      "Чат с ИИ: анализирует сообщения и предлагает привычки на основе диалога.",
  },
];

function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function normalizeText(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function heuristicReply(messages: ChatMessage[]): ActionResponse {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const t = normalizeText(lastUser);

  const tags = {
    sleep: /(сон|спать|бессон|утро|просып|поздно)/i.test(t),
    stress: /(стресс|тревог|паник|выгор|устал|переутом)/i.test(t),
    focus: /(прокраст|фокус|концентрац|отвлека|вниман)/i.test(t),
    food: /(еда|сладк|перекус|питани|вода|кофе)/i.test(t),
    movement: /(спорт|трен|ходьб|шаг|зарядк|бег)/i.test(t),
  };

  const habits: HabitSuggestion[] = [];

  if (tags.sleep) {
    habits.push(
      {
        title: "Мягкий вечерний ритуал",
        type: "Creating",
        trigger: "После того как поставил(а) будильник / закрыл(а) задачи на завтра",
        action: "10 минут: приглушить свет, убрать телефон подальше, 5 медленных вдохов",
        reward: "Ощущение завершённости дня и быстрее засыпаю",
        why: "Снижает возбуждение и закрепляет стабильный «сигнал ко сну».",
        goalDays: 30,
      },
      {
        title: "Стабильное утро (1 действие)",
        type: "Creating",
        trigger: "Когда встал(а) с кровати",
        action: "Сразу открыть шторы/свет и выпить стакан воды",
        reward: "Быстрее просыпаюсь, меньше «тумана»",
        why: "Свет и вода помогают ритмам, а простота повышает шанс закрепления.",
        goalDays: 30,
      }
    );
  }

  if (tags.stress) {
    habits.push({
      title: "Антистресс-пауза 60 секунд",
      type: "Creating",
      trigger: "Когда замечаю напряжение в теле или мысли начинают «гоняться»",
      action: "1 минута: выдох длиннее вдоха (например, 4–6) + расслабить плечи",
      reward: "Чуть спокойнее и яснее",
      why: "Короткие вмешательства легче делать регулярно — это ключ к привычке.",
      goalDays: 30,
    });
  }

  if (tags.focus) {
    habits.push({
      title: "Старт без сопротивления (2 минуты)",
      type: "Creating",
      trigger: "Перед началом сложной задачи",
      action: "Запустить таймер на 2 минуты и сделать самый маленький шаг (черновик/план/1 абзац)",
      reward: "Легче войти в работу",
      why: "Снижает порог входа и переобучает мозг ассоциировать задачу с быстрым успехом.",
      goalDays: 30,
    });
  }

  if (tags.food) {
    habits.push({
      title: "Стакан воды перед перекусом",
      type: "Creating",
      trigger: "Перед тем как взять перекус/сладкое",
      action: "Выпить стакан воды и подождать 2 минуты",
      reward: "Меньше импульсивных перекусов",
      why: "Пауза и гидратация часто снижают тягу, не требуя силы воли.",
      goalDays: 30,
    });
  }

  if (tags.movement) {
    habits.push({
      title: "Мини-движение каждый день",
      type: "Creating",
      trigger: "После обеда / после второй чашки кофе",
      action: "5–10 минут ходьбы или лёгкая разминка",
      reward: "Больше энергии и меньше «залипания»",
      why: "Низкая планка помогает стабилизировать рутину движения.",
      goalDays: 30,
    });
  }

  const fallback: HabitSuggestion[] =
    habits.length > 0
      ? habits
      : [
          {
            title: "Один маленький шаг",
            type: "Creating",
            trigger: "Когда думаю «надо бы…»",
            action: "Сформулировать 1 микро-действие на 2 минуты и сделать его сразу",
            reward: "Чувство контроля и прогресса",
            why: "Чем меньше трение, тем выше повторяемость — а значит, и формирование привычки.",
            goalDays: 30,
          },
          {
            title: "Короткая рефлексия вечером",
            type: "Creating",
            trigger: "Перед тем как лечь в кровать",
            action: "Записать 1 вещь, которая получилась, и 1 шаг на завтра",
            reward: "Спокойнее и понятнее, что делать дальше",
            why: "Укрепляет чувство эффективности и снижает неопределённость.",
            goalDays: 30,
          },
        ];

  const reply =
    habits.length > 0
      ? "Я вижу несколько тем в твоём сообщении. Вот привычки с минимальным трением — выбери 1–2, которые кажутся самыми реалистичными на ближайшие 2 недели."
      : "Ты думаешь это реально ИИ? Я тебе не буду бесплатные токены давать. Заплтишь звёздами, будет тебе ИИ, а пока довольствуйся тегами, прайдоха";

  return { reply, habits: fallback.slice(0, 3) };
}

async function openAiReply(messages: ChatMessage[]): Promise<ActionResponse | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const system = [
    "Ты — ИИ‑психолог и коуч по привычкам.",
    "Твоя задача: на основе чата предложить 1–3 привычки с низким трением (trigger-action-reward), объяснить почему они подходят.",
    "Всегда явно проговаривай в ответе, что такое «триггер», «действие» и «награда» (коротко, простым языком).",
    "Если пользователь хочет ИЗБАВИТЬСЯ от привычки или заменить её, обязательно объясни, что делать с триггером: можно либо уменьшать количество самих триггеров, либо заранее придумать новое действие на тот же триггер.",
    "Верни ответ СТРОГО в JSON без markdown.",
    "Формат: { reply: string, habits: HabitSuggestion[] } где habits[] = { title, type, trigger, action, reward, why, goalDays? }",
    "type строго одно из: Creating, Replacing, Breaking.",
    "Пиши на русском, избегай медицинских диагнозов и категоричных утверждений.",
  ].join("\n");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as any;
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") return null;
  const parsed = safeJsonParse<ActionResponse>(content);
  if (!parsed || typeof parsed.reply !== "string" || !Array.isArray(parsed.habits)) return null;
  return parsed;
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const messagesRaw = form.get("messages");
  const messages = typeof messagesRaw === "string" ? safeJsonParse<ChatMessage[]>(messagesRaw) : null;

  const safeMessages: ChatMessage[] =
    Array.isArray(messages) && messages.every((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      ? messages.slice(-30)
      : [];

  const ai = await openAiReply(safeMessages).catch(() => null);
  const out = ai ?? heuristicReply(safeMessages);
  return Response.json(out);
}

function randomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function AiPsychologistRoute() {
  const fetcher = useFetcher<ActionResponse>();
  const { createHabit } = useHabitStore();

  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Привет. Расскажи, что сейчас беспокоит или что хочешь улучшить (сон, стресс, продуктивность, питание, спорт). Я задам пару уточняющих вопросов и предложу привычки на основе чата.",
    },
  ]);

  const [added, setAdded] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (fetcher.state !== "idle") return;
    const reply = fetcher.data?.reply;
    if (!reply) return;

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: reply },
    ]);
  }, [fetcher.data, fetcher.state]);

  const isSending = fetcher.state !== "idle";

  function submit(text: string) {
    const content = text.trim();
    if (!content) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user" as const, content }];
    setMessages(nextMessages);
    setInput("");

    const fd = new FormData();
    fd.set("messages", JSON.stringify(nextMessages));
    fetcher.submit(fd, { method: "post" });
  }

  const suggestions = fetcher.data?.habits ?? [];

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6 lg:px-10 lg:py-10 space-y-6">
        <header className="space-y-2">
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            ИИ‑психолог
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Тут короче будет профессиональный ИИ-психолог, который будет все анализировать. За звёзды, конечно
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardContent className=" space-y-4">
              <ScrollArea className="h-[48dvh] sm:h-[52vh] p-2">
                <div className="space-y-3">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex",
                        m.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                          m.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {isSending && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-card  text-muted-foreground">
                        Думаю…
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="space-y-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Напиши, что происходит, и чего хочешь добиться…"
                  className="min-h-[96px] text-base sm:text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      submit(input);
                    }
                  }}
                />
                <div className="flex items-center justify-end gap-3">
                  <Button
                    onClick={() => submit(input)}
                    disabled={isSending || !input.trim()}
                  >
                    Отправить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold tracking-tight">Предложения</h2>
                <Badge variant="secondary">1–3 привычки</Badge>
              </div>

              {suggestions.length === 0 ? (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground bg-muted/10">
                  Напиши сообщение в чат — здесь появятся привычки, которые можно добавить в трекер.
                </div>
              ) : (
                <div className="space-y-3">
                  {suggestions.map((h) => {
                    const key = `${h.title}|${h.trigger}|${h.action}`;
                    const isAdded = !!added[key];

                    return (
                      <div key={key} className="rounded-xl border bg-card p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="font-semibold leading-snug">{h.title}</div>
                            <div className="text-xs text-muted-foreground">{h.why}</div>
                          </div>
                          <Badge variant="outline">{h.type}</Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-1">
                            <span className="text-muted-foreground">Триггер:</span>{" "}
                            <span className="flex-1">{h.trigger}</span>
                            <HelpTooltip text="Момент или ситуация, после которой включается привычка. Именно к нему потом «привязывается» новое поведение." />
                          </div>
                          <div className="flex items-start gap-1">
                            <span className="text-muted-foreground">Действие:</span>{" "}
                            <span className="flex-1">{h.action}</span>
                            <HelpTooltip text="Конкретный шаг, который ты делаешь после триггера. Лучше, если он маленький и понятный." />
                          </div>
                          <div className="flex items-start gap-1">
                            <span className="text-muted-foreground">Награда:</span>{" "}
                            <span className="flex-1">{h.reward}</span>
                            <HelpTooltip text="То, что делает привычку приятной для мозга: облегчение, расслабление, гордость или маленькое удовольствие." />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            disabled={isAdded}
                            onClick={() => {
                              createHabit({
                                id: randomId(),
                                type: h.type,
                                trigger: h.trigger,
                                action: h.action,
                                reward: h.reward,
                                progress: 0,
                                lastCompleted: null,
                                goalDays: h.goalDays ?? 30,
                                isAutomatic: false,
                                intensityHistory: [],
                                missedDays: [],
                              });
                              setAdded((prev) => ({ ...prev, [key]: true }));
                            }}
                          >
                            {isAdded ? "Добавлено" : "Добавить"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

