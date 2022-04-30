(function () {
    var _a, _b, _c, _d, _e, _f;
    const $ = (query) => document.querySelector(query);
    function calcTempo(mil) {
        const hora = Math.floor(mil / 3600);
        const min = Math.floor((mil % 3600) / 60);
        const seg = parseInt((mil % 60).toFixed(0));
        return { hora, min, seg };
    }
    function formatDate(strDate) {
        const date = new Date(strDate);
        const dia = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const mes = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        const ano = date.getFullYear();
        const hora = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        const min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        const seg = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
        return `${dia}/${mes}/${ano} às ${hora}:${min}:${seg}`;
    }
    function patio() {
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function adicionar(veiculo, salva) {
            var _a, _b;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${formatDate(veiculo.entrada)}</td>
                <td><i class="fa fa-power-off" aria-hidden="true" data-placa="${veiculo.placa}"></i></td>`;
            (_a = $("#patio")) === null || _a === void 0 ? void 0 : _a.appendChild(row);
            (_b = row.querySelector('.fa-power-off')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
                remover(this.dataset.placa);
            });
            if (salva)
                salvar([...ler(), veiculo]);
            $("#nome").value = "";
            $("#placa").value = "";
        }
        function remover(placa) {
            const { entrada, nome } = ler().find(v => v.placa === placa);
            const { hora, min, seg } = calcTempo((new Date().getTime() - new Date(entrada).getTime()) / 1000);
            if (confirm(`Deseja remover o veículo ${nome}?
            \nTempo de permanência: ${hora}h ${min}m ${seg}s
            \nValor: R$ ${((hora + min) * 0.5).toFixed(2)}`)) {
                const novo = ler().filter(v => v.placa !== placa);
                salvar(novo);
                $("#patio").innerHTML = '';
                novo.forEach(v => adicionar(v, false));
            }
        }
        function salvar(viculos) {
            localStorage.setItem('patio', JSON.stringify(viculos));
        }
        function render() {
            $("#patio").innerHTML = '';
            const patio = ler();
            if (patio.length) {
                patio.forEach(veiculo => adicionar(veiculo));
            }
        }
        return { ler, adicionar, salvar, render, remover };
    }
    patio().render();
    (_a = $('[data-js="bntCadastrar"]')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        var _a, _b;
        const nome = (_a = $("#nome")) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        if (!nome || !placa) {
            alert(`O Nome e a placa são obrigatórios!`);
            return;
        }
        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
    });
    var modal = $('[data-js="modal"]');
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
    (_b = $('[data-js="home"]')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
        modal.style.display = "block";
    });
    (_c = $('[data-js="cadastro"]')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
        modal.style.display = "block";
    });
    (_d = $('[data-js="relatorio"]')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => {
        modal.style.display = "block";
    });
    (_e = $('[data-js="span-modal"]')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => {
        modal.style.display = "none";
    });
    (_f = $('[data-js="btn-fechar"]')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', () => {
        modal.style.display = "none";
    });
})();
