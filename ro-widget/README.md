# ویجت اصلی «رو» از وب‌سایت روانت

این نسخه بر اساس ویجت موجود در لینک مرجع روانت بازسازی شده است؛ ابعاد، رنگ‌ها، ساختار پنل، Launcher، Bubbleها و Transitionها مطابق همان تجربه هستند.

## فایل‌ها

- `RavanetRoWidget.jsx` — کامپوننت مستقل React
- `ro-widget.css` — استایل کامل، RTL و Responsive

## استفاده در هر اپلیکیشن React

```jsx
import RavanetRoWidget from './ro-widget/RavanetRoWidget';

export default function App() {
  const sendToRo = async (text, history) => {
    const response = await fetch('/api/ro/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, history })
    });

    const data = await response.json();
    return data.message;
  };

  return (
    <>
      {/* Application content */}
      <RavanetRoWidget onSend={sendToRo}/>
    </>
  );
}
```

اگر `onSend` ارسال نشود، پاسخ‌های نمونه داخلی برای Prototype استفاده می‌شوند.

## حالت کنترل‌شده

```jsx
const [roOpen, setRoOpen] = useState(false);

<RavanetRoWidget
  open={roOpen}
  onOpenChange={setRoOpen}
  onSend={sendToRo}
/>
```

---

# مشخصات دقیق ظاهری

## جایگاه کلی

```css
position: fixed;
bottom: 16px;
left: 16px;
z-index: 9999;
direction: rtl;
```

در رابط RTL، رو به‌صورت ثابت در پایین سمت چپ قرار می‌گیرد.

## Launcher اصلی

- ابعاد: `50×50px`
- پس‌زمینه: Transparent
- فرم چهره: دایره با شعاع SVG برابر `46`
- Fill: گرادیان شعاعی از `#10281C` به `#07140F`
- Stroke: `#37B66E` با opacity برابر `.38`
- چشم‌ها: `#C7FF55` همراه Glow
- Shadow:

```css
filter:
  drop-shadow(0 10px 18px rgba(0,0,0,.48))
  drop-shadow(0 0 14px rgba(199,255,85,.16));
```

- Hover: افزایش جزئی Brightness و Glow
- Active: Scale تا `.96`
- Focus: حلقه Lime برای دسترسی‌پذیری
- چهره به شکل بسیار محدود جهت موس را دنبال می‌کند

## پنل گفتگو

- عرض: حداکثر `360px`
- ارتفاع: حداکثر `512px`
- فاصله از Launcher: `69.6px`
- Radius: `21.6px`
- پس‌زمینه: `rgba(8,23,17,.88)`
- Backdrop blur: `20px`
- Border: `rgba(181,243,201,.12)`
- Shadow:

```css
box-shadow:
  0 24px 60px rgba(0,0,0,.5),
  0 0 0 1px rgba(199,255,85,.05);
```

## Transition بازشدن پنل

Transition اصلی نسخه مرجع از Spring استفاده می‌کند:

```js
{
  type: 'spring',
  stiffness: 380,
  damping: 30,
  mass: 0.8
}
```

حالت‌ها:

```js
initial: { opacity: 0, y: 18, scale: 0.94 }
animate: { opacity: 1, y: 0, scale: 1 }
exit:    { opacity: 0, y: 12, scale: 0.96 }
```

در نسخه CSS مستقل، نزدیک‌ترین معادل استفاده شده است:

```css
transition:
  opacity 220ms ease,
  transform 360ms cubic-bezier(.16,1,.3,1),
  visibility 220ms;
```

این Transition فقط روی خود ویجت اجرا می‌شود و Hero یا داشبورد را حرکت نمی‌دهد.

## Header

- ارتفاع: `53px`
- Avatar رو: `30×30px`
- عنوان: «رو» با اندازه `13.5px`
- زیرعنوان: «همراه روانت» با اندازه `11px`
- هنگام پردازش، زیرعنوان به `…` تغییر می‌کند
- Close button: `32×32px`
- Divider: `rgba(181,243,201,.1)`

## پیام‌ها

### پیام Ro

```css
max-width: 85%;
background: #0A1210;
color: #F7FBF8;
border: 1px solid rgba(255,255,255,.05);
border-radius: 17px;
border-bottom-right-radius: 4px;
font-size: 13.5px;
line-height: 24px;
```

### پیام کاربر

```css
max-width: 85%;
background: #37B66E;
color: #05100B;
border-radius: 17px;
border-bottom-left-radius: 4px;
font-size: 13.5px;
line-height: 24px;
```

### Transition پیام

نسخه مرجع:

```js
initial: { opacity: 0, y: 8 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.28 }
```

## Composer

- ارتفاع Wrapper: `42px`
- فرم: Pill کامل
- Background: `rgba(5,16,11,.7)`
- Border: `rgba(181,243,201,.12)`
- Input: `13.5px`
- Placeholder: «هرچی هست…»
- Send button: `32×32px`
- رنگ Send: `#C7FF55`
- Hover Send: `#D8FF86`
- Enter پیام را ارسال می‌کند

## حالات چهره Ro

کامپوننت حالت‌های زیر را پشتیبانی می‌کند:

- `idle`
- `listen`
- `thinking`
- `sleepy`
- `surprise`

در حالت Thinking، دو چشم به سه نقطه تبدیل می‌شوند. در حالت Listen چشم‌ها بازتر می‌شوند. Launcher جهت موس را به‌صورت محدود دنبال می‌کند.

## رفتار و دسترسی‌پذیری

- بستن با کلید `Escape`
- Focus خودکار Input پس از بازشدن
- Focus trap داخل پنل
- Scroll خودکار به آخرین پیام
- `aria-live="polite"`
- حالت Controlled و Uncontrolled
- Loading و Error state
- پشتیبانی از `prefers-reduced-motion`
- عدم ایجاد Motion روی Hero یا محتوای داشبورد

## Responsive

```css
width: min(360px, calc(100vw - 32px));
height: min(512px, calc(100dvh - 102.4px));
```

در عرض کمتر از `420px`:

- فاصله از لبه‌ها: `14px`
- عرض پنل: `calc(100vw - 28px)`
- فاصله‌ی پنل از Launcher: `66px`

## قرارداد API پیشنهادی

### Request

```json
{
  "text": "دیشب دوباره خوابم نبرد",
  "history": [
    { "role": "ro", "text": "سلام. من رو‌ام. اینجام." },
    { "role": "user", "text": "دیشب دوباره خوابم نبرد" }
  ]
}
```

### Response

```json
{
  "message": "می‌شنوم. وقتی شب ساکت می‌شه، فکرها گاهی بلندتر می‌شن. بیشتر کدوم فکر برمی‌گرده؟"
}
```

## Prompt آماده برای هوش مصنوعی دیگر

```text
ویجت Ro را دقیقاً مطابق کامپوننت RavanetRoWidget.jsx و فایل ro-widget.css داخل داشبورد فارسی RTL روانت قرار بده. Launcher یک چهره دایره‌ای 50px در پایین سمت چپ است. پنل گفتگو حداکثر 360×512px، با پس‌زمینه نیمه‌شفاف #081711، Blur بیست پیکسل، Radius حدود 22px و Bubbleهای سبز/تیره است. Transition پنل باید معادل Spring با stiffness 380، damping 30 و mass 0.8 باشد. پیام‌ها با opacity و y=8 طی 280ms وارد شوند. چهره Ro باید حالت‌های idle، listen و thinking داشته باشد و در حالت thinking به سه نقطه تبدیل شود. هیچ Motion، Parallax یا Scale روی Hero و محتوای داشبورد اعمال نکن؛ Transitionها فقط داخل ویجت باشند. کل ویجت باید RTL، Responsive و Keyboard Accessible باشد.
```
