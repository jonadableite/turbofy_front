export default function Head() {
  return (
    <>
      {/* Preload de CSS com atributo 'as' correto */}
      <link rel="preload" href="/styles/layout.css" as="style" />
      {/* Garantir que o recurso pré-carregado seja utilizado */}
      <link rel="stylesheet" href="/styles/layout.css" />
    </>
  );
}