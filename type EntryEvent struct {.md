type EntryEvent struct {
Id string `json:"id"`

<!-- CondoId string `json:"condoId"` -->

CameraId string `json:"cameraId"`
PlateNumber string `json:"plateNumber"`
CaptureTime string `json:"captureTime"`

<!-- PicName string `json:"picName"` -->

VehiclePhotoHash string `json:"vehiclePhotoHash"`
PlatePhotoHash string `json:"platePhotoHash"`
}

<!-- Workflow: Registrar gateEvents-->

inputs:
Eu vou receber entradas do heimdall - Eventos - O identificador da entidade responsavel por liberar o accesso - fotos da placa do veiculo - numero da placa - fotos do veiculo - A hora que a entrada foi liberada - O identificador da camera que registrou a entrada - Escopo - En quais condos o resposavel pode atuar - En quais condos o resposavel quer atuar

    - Estados
        step 1: Registrar eventos (registerEvents)
            Side effects:
                - Persistir os dados do evento
            states depedes:
                - Procurar os restantes dados que precisa para persistir o evento
                    1- Procurar vehiculo a partir da placa
                    2- procurar condominio a partir do vehiculo e do escopo
                    3- procurar a unit a partir do identificador que tem o vehiculo
                    4- Procurar o responsavel a partir identificador dado no evento

        step 2: Mover as fotos pra salvar permanentemente (storeFotosPermantely)
            Side effects:
                - Persistir as fotos em um lugar permanente
                    states depends on:
                        1- Procurar a foto da placa no registro temporario a partir do identificador dado no evento
                        2- Procurar a foto do veiculo no registro temporario a partir do identificador dado no evento
                            side effects:
                                - Mover as fotos para um lugar permanente

    TODO: step 3: Registrar Auditoria de eventos
            Side effects:
                - Persistir os dados do evento

Respeito ao Id do evento, se asegurar de nao salvar o evento multiples vezes
