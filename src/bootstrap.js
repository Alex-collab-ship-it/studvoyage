import { Alert } from 'react-bootstrap';
let months = ['янв.', 'фев.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.', 'сен.', 'окт.', 'ноя.', 'дек.']
const CONSTANTS = {
    source_url: 'https://resource.studvoyage.ru/',
    url: 'https://api.studvoyage.ru',
    colors: ['#FFFCB0', '#D4FFC0', '#D1F4FF', '#FDD0B7'], 
    cookie: {
        get: name => {
            let c = document.cookie.match(`(?:(?:^|.*; *)${name} *= *([^;]*).*$)|^.*$`)[1]
            if (c) return decodeURIComponent(c)
        },
        set: (name, value, opts = {}) => {
            if (opts.days) {
                opts['max-age'] = opts.days * 60 * 60 * 24;
    
                delete opts.days 
            }
            opts = Object.entries(opts).reduce(
                (accumulatedStr, [k, v]) => `${accumulatedStr}; ${k}=${v}`, ''
            )
            document.cookie = name + '=' + encodeURIComponent(value) + opts
        },
        delete: (name, opts) => CONSTANTS.cookie.set(name, '', {'max-age': -1, ...opts}) 
    },
    formatDate: (date) => {
        return parseInt(date.split('-')[2]) + ' ' + months[parseInt(date.split('-')[1])-1]
    },
    period: (start, end) => {
        if (start[1] === end[1]){
            return `${parseInt(start[2])} - ${parseInt(end[2])} ${months[parseInt(start[1])-1]}`
        }
        return this.formatDate(start) + ' - ' + this.formatDate(end)
    },
    formatTime: (datetime) => {
        return `${parseInt(datetime[0].split('-')[2])} ${months[parseInt(datetime[0].split('-')[1])-1]} ${datetime[1].substring(0,5)}`
    }
}

export const ErrorMsg = ({setState, state, }) => {
    setTimeout(() => setState(p => ({ ...p, errorMsg: '' })), 3000)
    return (
        <div className='position-fixed' style={{ width: '200px', top: '10px', right: '10px', zIndex: '999999' }}>
            <Alert show={state.errorMsg !== ''} variant="danger" onClose={() => setState(p => ({ ...p, errorMsg: '' }))} dismissible>
                <Alert.Heading>Ошибка</Alert.Heading>
                <p>
                    {state.errorMsg}
                </p>
            </Alert>
        </div>
    )
} 

export const SuccessMsg = ({setState, state, }) => {
    setTimeout(() => setState(p => ({ ...p, successMsg: '' })), 3000)
    return (
        <div className='position-fixed' style={{ width: '200px', top: '10px', right: '10px', zIndex: '999999' }}>
            <Alert show={state.successMsg !== ''} variant="success" onClose={() => setState(p => ({ ...p, successMsg: '' }))} dismissible>
                <Alert.Heading>Success!</Alert.Heading>
                <p>
                    {state.successMsg}
                </p>
            </Alert>
        </div>
    )
}

export default CONSTANTS