interface Veiculo {
    nome: string;
    placa: string;
    entrada: Date | string;
}

(function () {
    const $ = (query:string) : HTMLInputElement | null => document.querySelector(query);
    
    function calcTempo(mil: number) {
        const hora = Math.floor(mil / 3600);
        const min = Math.floor((mil % 3600) / 60);
        const seg = parseInt((mil % 60).toFixed(0));
        return {hora, min, seg};
    }

    function formatDate(strDate: string | Date) {
        const date = new Date(strDate);
        const dia = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const mes = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        const ano = date.getFullYear();
        const hora = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        const min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        const seg = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
        return `${dia}/${mes}/${ano} às ${hora}:${min}:${seg}`;
    }

    function patio(){
        
        function ler(): Veiculo[] {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }

        function adicionar(veiculo: Veiculo, salva?: boolean){
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${formatDate(veiculo.entrada)}</td>
                <td><i class="fa fa-power-off" aria-hidden="true" data-placa="${veiculo.placa}"></i></td>`;
            $("#patio")?.appendChild(row);
            
            row.querySelector('.fa-power-off')?.addEventListener('click', function (){
                remover(this.dataset.placa);
            });
            if(salva) salvar([...ler(), veiculo]); $("#nome")!.value = ""; $("#placa")!.value = "";
        }
        
        function remover(placa: string){
            const {entrada, nome} = ler().find(v => v.placa === placa);
            const {hora, min, seg} = calcTempo((new Date().getTime() - new Date(entrada).getTime()) / 1000);

            if(confirm(`Deseja remover o veículo ${nome}?
            \nTempo de permanência: ${hora}h ${min}m ${seg}s
            \nValor: R$ ${((hora+min) * 0.5).toFixed(2)}`)){
                const novo = ler().filter(v => v.placa !== placa);
                salvar(novo);
                $("#patio")!.innerHTML = '';
                novo.forEach(v => adicionar(v, false));
            }
        }

        function salvar(viculos: Veiculo[]){
            localStorage.setItem('patio', JSON.stringify(viculos));
        }

        function render(){
            $("#patio")!.innerHTML = '';
            const patio = ler();
            if(patio.length){
                patio.forEach(veiculo => adicionar(veiculo));
            }
        }
        
        return { ler, adicionar, salvar, render, remover };
    }

    patio().render();

    $('[data-js="bntCadastrar"]')?.addEventListener('click', () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;

        if(!nome || !placa) {
            alert(`O Nome e a placa são obrigatórios!`);
            return;
        }

        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true );
    });

    var modal = $('[data-js="modal"]');
    window.onclick = function(event: any) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    $('[data-js="home"]')?.addEventListener('click', () => {
        modal.style.display = "block";
    });
    $('[data-js="cadastro"]')?.addEventListener('click', () => {
        modal.style.display = "block";
    });
    $('[data-js="relatorio"]')?.addEventListener('click', () => {
        modal.style.display = "block";
    });
    $('[data-js="span-modal"]')?.addEventListener('click', () => {
        modal.style.display = "none";
    });
    $('[data-js="btn-fechar"]')?.addEventListener('click', () => {
        modal.style.display = "none";
    });

})();