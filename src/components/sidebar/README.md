# Sidebar Component - Aceternity UI

Componente Sidebar responsivo e animado integrado ao tema Turbofy.

## 📦 Instalação

O componente já está instalado e pronto para uso. As dependências necessárias já estão no projeto:

- ✅ `framer-motion` - Animações
- ✅ `@tabler/icons-react` - Ícones
- ✅ `tailwind-merge` - Merge de classes CSS
- ✅ Tailwind CSS v4 - Estilização

## 🎨 Tema e Cores

O componente está totalmente integrado ao tema do Turbofy:

- **Background**: `bg-card` (usa variável CSS `--card`)
- **Borders**: `border-border` (usa variável CSS `--border`)
- **Text**: `text-foreground` (usa variável CSS `--foreground`)
- **Primary**: `bg-primary` (usa variável CSS `--primary` - azul #3177fa)
- **Hover**: `hover:bg-accent/50` (usa variável CSS `--accent`)

## 📖 Uso Básico

```tsx
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconBrandTabler, IconSettings } from "@tabler/icons-react";

export default function MyPage() {
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className="h-5 w-5 text-foreground" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <IconSettings className="h-5 w-5 text-foreground" />,
    },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody>
          <div className="flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1">
        {/* Conteúdo principal */}
      </main>
    </div>
  );
}
```

## 🎯 Componentes Disponíveis

### `Sidebar`
Componente principal que gerencia o estado do sidebar.

**Props:**
- `open?: boolean` - Controla se o sidebar está aberto
- `setOpen?: Dispatch<SetStateAction<boolean>>` - Função para controlar o estado
- `animate?: boolean` - Habilita/desabilita animações (padrão: `true`)

### `SidebarBody`
Container principal do sidebar. Renderiza versões desktop e mobile automaticamente.

### `SidebarLink`
Link individual do sidebar.

**Props:**
- `link: Links` - Objeto com `label`, `href` e `icon`
- `className?: string` - Classes CSS adicionais

### `useSidebar`
Hook para acessar o contexto do sidebar dentro de componentes filhos.

## 📱 Responsividade

- **Desktop**: Sidebar fixo à esquerda, expande/colapsa ao passar o mouse
- **Mobile**: Sidebar oculto por padrão, abre como drawer ao clicar no ícone de menu

## 🎨 Customização

### Cores

O componente usa as variáveis CSS do tema. Para customizar, edite `globals.css`:

```css
:root {
  --card: 0 0% 8%; /* Cor de fundo do sidebar */
  --border: 0 0% 20%; /* Cor das bordas */
  --primary: 217 91% 60%; /* Cor primária (azul) */
}
```

### Animações

As animações são controladas pelo Framer Motion. Para customizar, edite `sidebar.tsx`:

```tsx
animate={{
  width: animate ? (open ? "300px" : "60px") : "300px",
}}
```

## 📝 Exemplo Completo

Veja `sidebar-demo.tsx` para um exemplo completo de uso.

## 🔗 Integração com Next.js

O componente é um Client Component (`"use client"`), então pode ser usado diretamente em páginas do Next.js App Router.

```tsx
// app/dashboard/layout.tsx
import SidebarDemo from "@/components/sidebar-demo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <SidebarDemo />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

