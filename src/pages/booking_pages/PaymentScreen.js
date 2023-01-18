import { useLocation } from "react-router-dom"


export const PaymentScreen = () => {
    const location = useLocation()
    const data = location.state

    console.log(1)

    return (
        <div className="container-fluid d-flex flex-column mt-5 p-0 pt-5 justify-content-center ">
            <h1 className="m-0 p-0 mt-5 mb-4 text-center">Почти всё!</h1>
            <h3 className="m-0 p-0 mb-5 text-center">Вы успешно забронировали тур и осталось его оплатить</h3>
            <div className="card d-flex rounded-4 p-sm-5 p-4 mx-auto flex-column" style={{ maxWidth: '600px'}}>
                <h4 className="mb-3">Оплата</h4>
                <p className="mb-3">
                    На данный момент мы не подключили систему принятия платежей.
                    Для оплаты, свяжись с 
                    <a href='http://t.me/vikentiykopytkov'> менеджером проекта</a>, напиши в сообщения
                    <a href='http://vk.com/studvoyage'> группы вконтакте</a> или отправь письмо на
                    <a href='mailto:hello@studvoyage.ru'> hello@studvoyage.ru</a>
                    
                </p>
                <p>Ну или просто дождись пока мы тебе позвоним :)</p>
            </div>
        </div>
    )
}

