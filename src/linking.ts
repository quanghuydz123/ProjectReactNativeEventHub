//Xử lý click link giống website nhưng truy cập vào app
const config = {
    screens:{
        NotFound:'*'
    }
}

const linking:any = {
    prefixes: ['eventhub://app', 'https://eventhub.com'],
    config

}
export default linking