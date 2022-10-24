/* ----------- CÁLCULO DE PAGO PERIÓDICO -------------
--------------------- INPUTS -------------------------
monto ----- Monto original
plazo ----- Plazo
periodos -- Periodicidad (semanal, quincenal, mensual)
ti -------- Tasa de interés
iva ------- IVA

tp -------- Tasa periódica
tpi ------- Tasa periódica + IVA
pp -------- Pago periódico
------------------------------------------------------ */
const monto = 12000
const plazo = 12
const periodos = "mensual"
const ti = .8
const iva = .16

/**
 * Calcular tasa periódica de acuerdo a la periodicidad del préstamo
 * @param  {float}  tasa            tasa de interés anual
 * @param  {string} periodicidad    tipo de préstamo (semanal, quincenal, mensual)
 * @return {int}    tasa por periodo, se divide tasa entre número de periodos por año
 * 
 * Notas
 * La tasa periódica se calcula con valores constantes
 * depende del número de plazos, depende de tipo de periodicidad
 */
function getTasaPeriodica(tasa, periodicidad) {
    switch (periodicidad) {
        case "semanal":
            return tasa / 52
        case "quincenal":
            return tasa / 24
        case "mensual":
            return tasa / 12
        default:
            return
    }
}

/**
 * Calcular pago por periodos
 * @param  {int}    monto   cantidad de préstamo
 * @param  {int}    plazo   número de pagos
 * @param  {float}  tp      tasa por periodo
 * @return {float}  pago periódico redondeado a dos decimales
 */
function getPagoPeriodico(monto, plazo, tp) {
    const tpi = tp * (1 + iva) // Calular tasa de interés + IVA
    const pago = (monto * (tpi) * (Math.pow(1 + tpi, plazo))) / (Math.pow(1 + tpi, plazo) - 1)
    return parseFloat(pago.toFixed(2)) // Redondear pago a dos decimales y convertir a float
}

const tp = getTasaPeriodica(ti, periodos)
let pp = getPagoPeriodico(monto, plazo, tp)

/* ------------------ FECHAS -------------------------
--------------------- OUTPUTS ------------------------
fAct ------ Fecha activación (disposición)
fPago ----- Fecha primer pago
fExp ------ Fecha de expiración
------------------------------------------------------ */
let fAct
let fPago
let fExp

/**
 * Obtener fecha de activación al activar el préstamo
 * @return {Date}  fecha actual
 */
function activarCredito() {
    return new Date() // Regresar fecha actual
}

/**
 * Calcular fecha del siguiente pago con base a una fecha actual
 * @param  {Date}   fAct            fecha de activación (disposición)
 * @param  {string} periodicidad    tipo de préstamo (semanal, quincenal, mensual)
 * @return {Date}   fecha del siguiente pago
 */
function getFechaPago(fAct, periodicidad) {
    fecha = new Date(fAct)
    const dia = fecha.getDate() // Día del mes

    switch (periodicidad) {
        case "semanal":
            const diaNum = fecha.getDay() // Número del día de la semana (0-domingo al 6-sábado)

            if (diaNum >= 0 && diaNum <= 3) { // De Domingo a Miércoles
                fecha.setDate(dia + (6 - diaNum)) // Sábado de esa misma semana
            } else { // De Jueves a Sábado
                fecha.setDate(dia + (13 - diaNum)) // Sábado de la siguiente semana
            }

            break
        case "quincenal":
            if (dia >= 1 && dia <= 7) {
                fecha.setDate(15);
            } else if (dia >= 8 && dia <= 23) {
                fecha.setDate(1);
                fecha.setMonth(fecha.getMonth() + 1); // 1ero del siguiente mes
            } else {
                fecha.setDate(15);
                fecha.setMonth(fecha.getMonth() + 1); // 15 del siguiente mes
            }
            break
        case "mensual":
            fecha.setDate(1);
            if (dia >= 1 && dia <= 15) {
                fecha.setMonth(fecha.getMonth() + 1);
            } else {
                fecha.setMonth(fecha.getMonth() + 2);
            }
            break
        default:
            break
    }
    return fecha
}

fAct = activarCredito()
fPago = getFechaPago(fAct, periodos)

/* -------------- TABLA AMORTIZACIÓN -----------------
---------------------- OUTPUTS -----------------------
periodo ------ Periodo actual
fecha -------- Fecha de pago
amort -------- Amortización
intereses ---- Parte del pago que corresponde a Intereses
iva pago ----- Parte del pago que corresponde a IVA
cuota, pp ---- Pago periódico
saldo -------- Nuevo Saldo
------------------------------------------------------ */

const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

/**
 * Traducir a español y formatear fecha
 * @param  {Date}   fecha  fecha a agregar formato
 * @return {string} string de fecha traducida a español
 */
function formatearFecha(fecha) {
    return `${dias[fecha.getDay()]}, ${fecha.getDate()} ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`
}

/**
 * Imprimir fila de tabla de amortización
 * @param  {int}    periodo         número de pago
 * @param  {Date}   fecha           fecha de pago
 * @param  {float}  amortizacion    parte de amortización
 * @param  {float}  intereses       parte de intereses
 * @param  {float}  iva             parte de iva
 * @param  {float}  cuota           cuota periódica
 * @param  {float}  saldo           saldo actual
 */
function printTabla(periodo, fecha, amortizacion, intereses, iva, cuota, saldo) {
    amortizacion = amortizacion.toFixed(2)
    intereses = intereses.toFixed(2)
    iva = iva.toFixed(2)
    saldo = saldo.toFixed(2)
    fecha = formatearFecha(fecha)
    console.log(`${periodo}  |  ${fecha}  |  ${amortizacion}  |  ${intereses}  |  ${iva}  |  ${cuota}  |  ${saldo}  `)
}

/**
 * Calcular valores de columna de tabla amortización
 * @param  {float}  monto   saldo actual
 * @param  {int}    plazo   número de pagos
 */
function getTablaAmortizacion(monto, plazo) {
    let amort = 0
    let intereses = 0
    let ivaPago = 0
    let saldo = monto
    let periodo = 0
    let fecha = activarCredito()

    printTabla(periodo, fecha, amort, intereses, ivaPago, pp, saldo)

    // Actualizar valores
    while (periodo < plazo) {
        fecha = getFechaPago(fecha, periodos)
        intereses = tp * saldo
        ivaPago = iva * intereses
        amort = pp - intereses - ivaPago
        saldo = saldo - amort
        periodo += 1

        printTabla(periodo, fecha, amort, intereses, ivaPago, pp, saldo)
    }

    fExp = fecha
}

getTablaAmortizacion(monto, plazo)

// console.log(formatearFecha(fAct))
// console.log(formatearFecha(fPago))
// console.log(formatearFecha(fExp))
let totalActual = 10665.50 
let saldoPendiente = 500
let saldoFavor = 100
let pagos = 2

function pagar(cantidad) {
    if (cantidad + saldoFavor >= saldoPendiente) {
        cantidad += saldoFavor 
        let dif = saldoPendiente - cantidad
        saldoPendiente = dif
        saldoFavor = dif

        if (-1 * dif > 0) {
            saldoPendiente = 0
            saldoFavor = -1 * dif
        }
    } else {
        saldoFavor += cantidad
    }

    console.log(`Saldo pendiente: ${saldoPendiente} \nSaldo a favor: ${saldoFavor}`)
}

function abonar(cantidad) {
    if (saldoPendiente > 0) {
        console.log("Antes de abonar a capital, debes pagar el saldo pendiente")
        return 
    }

    saldoFavor += cantidad
    totalActual -= saldoFavor // checar si pago todo o no

    pp = getPagoPeriodico(totalActual, plazo - pagos, tp)
    getTablaAmortizacion(totalActual, plazo - pagos)
}

abonar(500)
pagar(600)
abonar(2465.5)
//