document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("card-form");
    const btnLimpar = document.getElementById("btn-limpar");
    const previewContainer = document.getElementById("preview-container");
    const codigoGerado = document.getElementById("codigo-gerado");

    setPreviewEmptyState();

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const snippet = gerarSnippetHtml();
        atualizarPreview(snippet);
        codigoGerado.value = snippet;
    });

    btnLimpar.addEventListener("click", function () {
        form.reset();
        setPreviewEmptyState();
        codigoGerado.value = "";
    });

    function setPreviewEmptyState() {
        previewContainer.innerHTML = "";
        previewContainer.classList.add("preview-container--empty");
        previewContainer.textContent = "O preview do card aparecerá aqui após você gerar o código.";
    }

    function atualizarPreview(html) {
        previewContainer.classList.remove("preview-container--empty");
        previewContainer.innerHTML = html;
    }

    function gerarSnippetHtml() {
        const tipo = document.getElementById("tipo").value.trim();
        const nome = document.getElementById("nome").value.trim();
        const icone = document.getElementById("icone").value.trim() || "Icones/poder-generico.png";
        const alt = document.getElementById("alt").value.trim() || nome || "Ícone do poder";

        const custoPm = document.getElementById("custo-pm").value.trim();
        const custoSan = document.getElementById("custo-san").value.trim();
        const custoPod = document.getElementById("custo-pod").value.trim();
        const custoOutros = document.getElementById("custo-outros").value.trim();

        const tempoValor = document.getElementById("tempo-valor").value.trim();
        const tempoUnidade = document.getElementById("tempo-unidade").value.trim();
        const descricaoRaw = document.getElementById("descricao").value.trim();

        const tituloFinal = tipo ? `${nome} - ${tipo}` : nome || "[Nome]";

        const partesCusto = [];

        if (custoPm) {
            partesCusto.push(`${custoPm} PM`);
        }
        if (custoSan) {
            partesCusto.push(`${custoSan} SAN`);
        }
        if (custoPod) {
            partesCusto.push(`${custoPod} POD`);
        }
        if (custoOutros) {
            partesCusto.push(custoOutros);
        }

        const temCusto = partesCusto.length > 0;
        const textoCusto = temCusto
            ? `Custo: ${partesCusto.join("; ")}`
            : "";

        let textoTempo = "";
        let temTempo = false;

        if (tempoValor && tempoUnidade) {
            textoTempo = `Tempo de conjuração: ${tempoValor} ${tempoUnidade}`;
            temTempo = true;
        } else if (tempoUnidade) {
            textoTempo = `Tempo de conjuração: ${tempoUnidade}`;
            temTempo = true;
        } else if (tempoValor) {
            textoTempo = `Tempo de conjuração: ${tempoValor}`;
            temTempo = true;
        }

        const descricao = descricaoRaw
            ? descricaoRaw.replace(/\n/g, "<br>")
            : "[Descrição]";

        const linhaCusto = temCusto
            ? `        <p class="poder-card__custo"><strong>${escapeHtml(textoCusto)}</strong></p>\n`
            : "";

        const linhaTempo = temTempo
            ? `        <p class="poder-card__tempo"><strong>Tempo de conjuração:</strong> ${escapeHtml(extrairTextoTempo(textoTempo))}</p>\n`
            : "";

        const snippet =
            `<div class="poder-card">
                <img src="${escapeAttribute(icone)}" alt="${escapeAttribute(alt)}" class="poder-card__icone">
                <div class="poder-card__conteudo">
                    <h2 class="poder-card__titulo">${escapeHtml(tituloFinal)}</h2>
            ${linhaCusto}${linhaTempo}        <p class="poder-card__descricao">${descricao}</p>
                </div>
            </div>`;

        return snippet;
    }


    function extrairTextoTempo(textoTempoCompleto) {
        const chave = "Tempo de conjuração:";
        const indice = textoTempoCompleto.indexOf(chave);
        if (indice === -1) {
            return textoTempoCompleto;
        }
        return textoTempoCompleto.slice(indice + chave.length).trim();
    }

    function escapeHtml(texto) {
        return texto
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function escapeAttribute(texto) {
        return texto
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }
});
