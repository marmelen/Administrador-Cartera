/* ----------- CALCULO DE PAGO PERIODICO -------------
--------------------- INPUTS -------------------------
monto ----- Monto original
plazo ----- Plazo
periodos -- Periodicidad (semanal, quincenal, mensual)
ti -------- Tasa de interés
iva ------- IVA

tp -------- Tasa periodica
tpi ------- Tasa periodica + IVA
pp -------- Pago periódico
------------------------------------------------------ */
const monto = 10000
const plazo = 72
const periodos = "quincenal"
const ti = .8
const iva = .16

// La tasa periodica se calcula con valores constantes
// No depende del numero de plazos, depende de tipo de periodicidad
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

function getPagoPeriodico(monto, plazo, tp) {
    const tpi = tp * (1 + iva)
    const pago = (monto * (tpi) * (Math.pow(1 + tpi, plazo))) / (Math.pow(1 + tpi, plazo) - 1)
    return parseFloat(pago.toFixed(2))
}

const tp = getTasaPeriodica(ti, periodos)
const pp = getPagoPeriodico(monto, plazo, tp)

/* ------------------ FECHAS -------------------------
--------------------- OUTPUTS ------------------------
fAct ------ Fecha activacion (disposicion)
fPago ----- Fecha primer pago
fExp ------ Fecha de expiracion
------------------------------------------------------ */
let fAct
let fPago
let fExp

function activarCredito() {
    return new Date()
}

function getFechaPago(fAct, periodicidad) {
    fecha = new Date(fAct)
    const dia = fecha.getDate()

    switch (periodicidad) {
        case "semanal":
            const diaNum = fecha.getDay()

            if (diaNum >= 0 && diaNum <= 3) {
                fecha.setDate(dia + (6 - diaNum))
            } else {
                fecha.setDate(dia + (13 - diaNum))
            }

            break
        case "quincenal":
            if (dia >= 1 && dia <= 7) {
                fecha.setDate(15);
            } else if (dia >= 8 && dia <= 23) {
                fecha.setDate(1);
                fecha.setMonth(fecha.getMonth() + 1);
            } else {
                fecha.setDate(15);
                fecha.setMonth(fecha.getMonth() + 1);
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

/* -------------- TABLA AMORTIZACION -----------------
---------------------- OUTPUTS -----------------------
periodo ------ Periodo actual
fecha -------- Fecha de pago
amort -------- Amortizacion
intereses ---- Parte del pago que corresponde a Intereses
iva pago ----- Parte del pago que corresponde a IVA
cuota, pp ---- Pago periodico
saldo -------- Nuevo Saldo
------------------------------------------------------ */

const dias = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"]
const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];

function formatearFecha(fecha) {
    return `${dias[fecha.getDay()]}, ${fecha.getDate()} ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`
}

function printTabla(periodo, fecha, amortizacion, intereses, iva, cuota, saldo) {
    amortizacion = amortizacion.toFixed(2)
    intereses = intereses.toFixed(2)
    iva = iva.toFixed(2)
    saldo = saldo.toFixed(2)
    fecha = formatearFecha(fecha)
    console.log(`${periodo}  |  ${fecha}  |  ${amortizacion}  |  ${intereses}  |  ${iva}  |  ${cuota}  |  ${saldo}  `)
}

function getTablaAmortizacion() {
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

getTablaAmortizacion()

console.log(formatearFecha(fAct))
console.log(formatearFecha(fPago))
console.log(formatearFecha(fExp))