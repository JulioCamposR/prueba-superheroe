$(document).ready(function () {
    $('#searchForm').on('submit', function (e) {
        e.preventDefault();
        let heroId = $('#heroId').val();
        if (heroId) {
            getHeroInfo(heroId);
        } else {
            alert('Por favor, ingrese un número de SuperHero.');
        }
    });

    function getHeroInfo(heroId) {
        const apiUrl = `https://www.superheroapi.com/api.php/87fb8d4e42d70e5a56f2ec2db38d8780/${heroId}`;
        
        $.getJSON(apiUrl, function(data) {
            if (data.response === "error") {
                alert('SuperHero no encontrado. Intenta con otro número.');
                return;
            }

            // Mostrar información solo del heroe
            $('main > :not(#heroInfo)').addClass('hidden-content');
            $('#heroInfo').removeClass('d-none');

            // info y grafico
            $('#heroInfo').html(`
                <div class="col-md-8">
                    <h3>SuperHero Encontrado</h3>
                    <div class="card">
                        <div class="card-horizontal">
                            <img src="${data.image.url}" class="card-img-left" alt="${data.name}">
                            <div class="card-body">
                                <h5 class="card-title">Nombre: ${data.name}</h5>
                                <p class="card-text"><strong>Publicado por:</strong> ${data.biography.publisher}</p>
                                <p class="card-text"><strong>Ocupación:</strong> ${data.work.occupation}</p>
                                <p class="card-text"><strong>Primera Aparición:</strong> ${data.biography['first-appearance']}</p>
                                <p class="card-text"><strong>Altura:</strong> ${data.appearance.height.join(" / ")}</p>
                                <p class="card-text"><strong>Peso:</strong> ${data.appearance.weight.join(" / ")}</p>
                                <p class="card-text"><strong>Alianzas:</strong> ${data.connections['group-affiliation']}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <h3>Estadísticas de Poder para ${data.name}</h3>
                    <canvas id="heroStatsChart"></canvas>
                </div>
            `);

            renderHeroStats(data);
        });
    }

    function renderHeroStats(data) {
        const ctx = document.getElementById('heroStatsChart').getContext('2d');
        const statsData = {
            labels: ['Intelligence', 'Strength', 'Speed', 'Durability', 'Power', 'Combat'],
            datasets: [{
                data: [
                    data.powerstats.intelligence,
                    data.powerstats.strength,
                    data.powerstats.speed,
                    data.powerstats.durability,
                    data.powerstats.power,
                    data.powerstats.combat
                ],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
            }]
        };

        new Chart(ctx, {
            type: 'pie',
            data: statsData,
        });
    }
});
