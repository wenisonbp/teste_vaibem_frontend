const stages = [{
    status: "triagem",
    create: true,
    name: "Triagem",
    icon: "mr-2 fas fa-search",
    color: "card card-indigo card-outline"
}, {
    status: "em_atendimento",
    name: "Em atendimento",
    icon: "mr-2 fas fa-user-clock",
    color: "card card-navy card-outline"
}, {
    status: "escolonar_problema",
    name: "Escolonar o problema",
    icon: "mr-2 fas fa-temperature-high",
    color: "card card-danger card-outline"
}, {
    status: "pausado",
    name: "Pausado",
    icon: "mr-2 fas fa-pause-circle",
    color: "card card-secondary card-outline"
}, {
    status: "concluido",
    name: "Concluído",
    icon: "mr-2 fas fa-check-square",
    color: "card card-lime card-outline"
}, {
    status: "arquivado",
    name: "Arquivado",
    icon: "mr-2 fas fa-archive",
    color: "card card-warning card-outline"
}];


export { stages };