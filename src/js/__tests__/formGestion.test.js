import {
    addslashes
} from "../utils/formGestion"


test("addSlashes fonctionne bien", () => expect(addslashes("coucou'58 j'ai\ ")).toBe("coucou\\'58 j\\'ai "))