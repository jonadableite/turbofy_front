import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DashboardHeader } from "@/components/dashboard/header";

describe("DashboardHeader", () => {
  it("exibe o nome do usuário quando fornecido", () => {
    render(
      <DashboardHeader
        userName="Ana"
        progress={{ current: 1000, target: 2000 }}
        notifications={3}
      />
    );
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("exibe 'Usuário' quando o nome não está disponível", () => {
    render(<DashboardHeader notifications={0} />);
    expect(screen.getByText("Usuário")).toBeInTheDocument();
  });

  it("abre o menu do usuário ao clicar", () => {
    render(<DashboardHeader userName="João" />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByText("Meu Perfil")).toBeInTheDocument();
    expect(screen.getByText("Configurações")).toBeInTheDocument();
  });
});