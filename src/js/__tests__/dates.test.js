import {
    getDayToString,
    getMonthToString,
    getIdOfDay,
    datePhp,
    formatedHour,
    getFirstMonday,
    getNearestHour,
    getNearestMinute,
    convertMinutesToTime
} from "../utils/dates"

test("Le jour 0 correspond à dimanche", () => expect(getDayToString(0)).toBe("Dimanche"))
test("Le jour 7 n'existe pas", () => expect(getDayToString(8)).toBe(null))

test("Le mois 0 correspond à janvier", () => expect(getMonthToString(0)).toBe("Janvier"))
test("Le mois 12 n'existe pas", () => expect(getMonthToString(12)).toBe(null))

test("Le jour 'Dimanche' a pour id 0", () => expect(getIdOfDay("Dimanche")).toBe(0))
test("Le jour 'coucou' n'existe pas", () => expect(getIdOfDay("coucou")).toBe(null))

test("La date js est la bonne en php", () => expect(datePhp(new Date("2000 January 01"))).toBe("2000-1-1 0:0:0"))

test("Le nombre 15 est bien sur deux digites", () => expect(formatedHour(15)).toBe(15))
test("On a bien ajouté un '0' devant le '5'", () => expect(formatedHour(5)).toBe("05"))

test("Le lundi précédant le 30/04/23 est bien le 24/04/23", () => expect(getFirstMonday(new Date("2023 April 30"))).toStrictEqual(new Date("2023 April 24")))

test("L'heure la plus proche de 01:02 est 01:00", () => expect(getNearestHour(1, 2)).toBe(1))
test("L'heure la plus proche de 01:50 est 02:00", () => expect(getNearestHour(1, 50)).toBe(2))

test("1 minute se rapproche plus de 0 que de 30", () => expect(getNearestMinute(1)).toBe(0))
test("35 minutes se rapproche plus de 30 que de 0", () => expect(getNearestMinute(35)).toBe(30))

test("270 minutes correspondent à 02h30", () => expect(convertMinutesToTime(270)).toBe("04h30"))
