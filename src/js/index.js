document.addEventListener("DOMContentLoaded", () => {
    // ==================================================
    // Objetivo:
    // Enviar um texto para uma API do n8n e exibir
    // o HTML, CSS e a animação de background retornados.
    // ==================================================

    // ==================================================
    // Passo 1:
    // Capturar o evento de submit do formulário
    // para evitar o recarregamento da página.
    // ==================================================
    const form = document.querySelector(".form-group");

    // ==================================================
    // Passo 2:
    // Obter os elementos da interface e o valor
    // digitado pelo usuário.
    // ==================================================
    const description = document.getElementById("description");
    const htmlCode = document.getElementById("html-code");
    const cssCode = document.getElementById("css-code");
    const preview = document.getElementById("preview-section");
    const button = document.getElementById("generate-btn");

    // ==================================================
    // Função responsável por controlar o estado
    // de carregamento do botão.
    // ==================================================
    function setLoading(isLoading) {
        button.innerHTML = isLoading
            ? "Gerando Background..."
            : "Gerar Background Mágico...";
    }

    // ==================================================
    // Passo 6:
    // Exibir o HTML e CSS retornados pela API.
    // ==================================================
    function applyGeneratedPreview(html, css) {
        // Mostrar os códigos recebidos
        htmlCode.textContent = html;
        cssCode.textContent = css;

        // Mostrar o preview
        preview.style.display = "block";
        preview.innerHTML = html;

        // Remover estilos antigos
        const existingStyle = document.getElementById("dynamic-style");

        if (existingStyle) {
            existingStyle.remove();
        }

        // Inserir o novo CSS dinamicamente
        if (css) {
            const style = document.createElement("style");

            style.id = "dynamic-style";
            style.textContent = css;

            document.head.appendChild(style);
        }
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const descriptionValue = description.value.trim();

        if (!descriptionValue) {
            return;
        }

        // ==================================================
        // Passo 3:
        // Exibir indicador de carregamento.
        // ==================================================
        setLoading(true);

        try {
            // ==================================================
            // Passo 4:
            // Enviar uma requisição POST para a API
            // contendo a descrição do usuário.
            // ==================================================
            const response = await fetch(
                "https://rnxribeiro.app.n8n.cloud/webhook/f0eaaa29-5215-43d2-a828-d88cacfee8ad",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        descriptionValue,
                    }),
                }
            );

            // ==================================================
            // Passo 5:
            // Receber e processar a resposta da API.
            // ==================================================
            const data = await response.json();

            const html =
                data.html || "Nenhum código HTML retornado.";

            const css =
                data.css || "Nenhum código CSS retornado.";

            // ==================================================
            // Passo 6:
            // Exibir o resultado recebido.
            // ==================================================
            applyGeneratedPreview(html, css);
        } catch (error) {
            console.error("Erro ao gerar o background:", error);

            htmlCode.textContent = "Erro ao gerar o HTML.";
            cssCode.textContent = "Erro ao gerar o CSS.";
            preview.innerHTML = "";
        } finally {
            // ==================================================
            // Passo 7:
            // Remover o indicador de carregamento.
            // ==================================================
            setLoading(false);
        }
    });
});