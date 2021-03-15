/**
 * funcoes genericas
 */

// funcao para criar um par de objetos [{ key1:key2 },{ key2: key1 }] dado um array [[key1,key2]]
// ex: [[id,name]].reduce(toConverter,[]) = [{ [id]: name },{ [name]: id }]
const toConverter = (acc,cur) => [{ ...acc[0], [cur[0]]: cur[1] },{ ...acc[1], [cur[1]]: cur[0] }]

//funcao para separar um array [[key1,key2]] em dois arrays [[key1],[key2]]
// ex: [[id,name]].reduce(toSplittedArrays,[[],[]]) = [[id],[name]]
const toSplittedArrays = (acc,cur) => [[...acc[0],cur[0]],[...acc[1],cur[1]]]

// funcao para extrair um array de possiveis valores de um array de objetos,
// ex: 'status' => (acc, cartItem: { status }) => [all possible status cartItem have]
const toList = key => (acc, { [key]: value }) => !value || acc.includes(value) ? acc : [...acc,value]

//funcao para checar se um valor exist
const exist = value => !!value

/**
 * preparando os sellers para consumo
 */

// funcao para preparar os sellers para consumo
export const prepareSellersToConsume = (usableCarts) => () => {
    const options = usableCarts.reduce(toList('brandName'), []).sort()
    return { options }
}

/**
 * preparando os status para consumo
 */

// array com os status possiveis e suas traduçoes, em ordem de precedencia
const statusPairs = [                                   // precedencia
    ['closed','Fechado'],                               // 1o
    ['waitingPayment','Aguardando pagamento'],          // 2o
    ['waitingConfirmation','Aguardando confirmação'],   // 3o
    ['open','Aberto']                                   // 4o
]

// objeto para converter entre portugues e ingles
const [ENtoPT,PTtoEN] = statusPairs.reduce(toConverter,[{},{}])

// prepara o status para consumo
export const prepareStatusForConsume = (usableCarts) => () => {
    const available = usableCarts.reduce(toList('status'), [])
    const [EN,PT] = statusPairs.filter(([EN]) => available.includes(EN)).reduce(toSplittedArrays,[[],[]])
    return { options: { EN, PT }, convert: { ENtoPT, PTtoEN } }
}

/**
 * preparando os storeowners para consumo
 */

//funcao para limpar a razao (capitalizar e tirar os numeros)
const clean = str => str.replace(/\B[A-Z]/g,c => c.toLowerCase()).replace(/[0-9]/g,'')

// funcao para criar um array de pares [[id,razao]]
const toPair = storeowners => id => (razao => razao ? [id,clean(razao)]:null)(storeowners[id]?.razao)

// funcao para preparar os estoreowners para consumo
export const prepareStoreownersForConsume = (usableCarts, storeowners) => () => {
    const availableStoreowners = usableCarts.reduce(toList('buyerStoreownerId'), [])
    const pairs = availableStoreowners.map(toPair(storeowners)).filter(exist)
    const [ids,razoes] = pairs.reduce(toSplittedArrays,[[],[]])
    const [IdToRazao,RazaoToId] = pairs.reduce(toConverter,[{},{}])
    return { options: { razoes, ids }, convert: { IdToRazao, RazaoToId } }
}

/**
 * preparando os carts para consumo
 */

// funcao para retornar um filtro para os carrinhos de acordo com as variaveis
const withPredicate = (seller, buyerStoreownerId, status) => cart =>
(!seller||cart.brandName.startsWith(seller))&&
(!buyerStoreownerId||buyerStoreownerId===cart.buyerStoreownerId)&&
(!status||cart.status.startsWith(status))

// funcao para criar um objeto { status: [carts] }
const toStatusObject = (acc,cur) => cur.status ? ({ ...acc, [cur.status]: [...acc[cur.status]||[],cur] }) : prev

const toReadableDate = (dateInSeconds) => {
    const _added = new Date(dateInSeconds*1000)
    const _month = _added.getMonth()+1
    const _day = _added.getDate()
    const _hour = _added.getHours()
    const _minute = _added.getMinutes()
    const [month,day,hour,minute] = [_month,_day,_hour,_minute].map(value => `${(value < 10 ? '0':'')}${value}`)
    return `${day}/${month} as ${hour}:${minute}`
}

const toConsumableCarts = ({ added, lastUpdate, ...cart }) => {
    return { ...cart, added: toReadableDate(added.seconds), lastUpdate: lastUpdate && toReadableDate(lastUpdate.seconds) }
}

export const prepareCartsForConsume = (carts,seller,buyerStoreownerId,status) => () => {
    const available = carts.filter(withPredicate(seller,buyerStoreownerId,status)).map(toConsumableCarts)
    const byStatus = available.reduce(toStatusObject,{})
    return { available, byStatus }
}

/**
 * conversores de dados para o firebase
 */

// funcao para criar um array com todos os carrinhos
export const toCartArray = (acc,doc) => [...acc,{ ...doc.data(), id: doc.id, buyerStoreownerId: doc.ref.parent.parent.id }]

// funcao para criar um objeto com todos os storeowners
export const toStoreownerData = (acc,doc) => ({...acc,[doc.id]: doc.data() })

/**
 * callback para manter os estados da query sincronizados com a URL
 */

 //funcao para serializar cada query
const toQueryString = ([key,value]) => key && value ? `${key}=${value}`:''

// funcao para setar as variaveis da query
export const setQueryCallback = (location, setLocation, setQuery, key) => (value) => {
    setQuery(old => {
        const newQuery = { ...old, [key]: value }
        let query = Object.entries(newQuery).map(toQueryString).filter(exist).join('&')
        if(query) query = '?' + query
        setLocation( location + query )
        return newQuery
    })
}
