import crypto from "node:crypto";

export function hashPassword(password: string) {
	return new Promise<string>((resolve, reject) => {
		crypto.pbkdf2(password, "salt", 100000, 64, "sha256", (err, derivedKey) => {
			if (err) {
				reject(err);
			} else {
				resolve(derivedKey.toString("hex"));
			}
		});
	});
}

export function comparePassword(password: string, hashedPassword: string) {
	return new Promise<boolean>((resolve, reject) => {
		crypto.pbkdf2(password, "salt", 100000, 64, "sha256", (err, derivedKey) => {
			if (err) {
				reject(err);
			} else {
				resolve(derivedKey.toString("hex") === hashedPassword);
			}
		});
	});
}
