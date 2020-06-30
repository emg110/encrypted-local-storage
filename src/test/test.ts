import AppStorage from "../index";
import { expect } from "chai";

const masterkey = "example";
const password = "test";

describe("Password Management", function() {
	it("Should create a new password", function(done) {
		AppStorage.createPassword(masterkey, password)
		.then(() => {
			done();
		})
		.catch((err: any) => {
			done(err);
		})
	});

	it("Should verify the created password", function(done) {
		AppStorage.verifyPassword(masterkey, password)
		.then((obfuscatekey) => {
			expect(obfuscatekey).to.be.a("string");
			done();
		})
		.catch((err) => {
			done(err);
		})
	});

	it("Should fail when verify with a wrong password", function(done) {
		AppStorage.verifyPassword(masterkey, "wrong password")
		.then((obfuscatekey) => {
			throw new Error("Invalid test, must throw")
		})
		.catch((err) => {
			expect(err.message).to.be.equal("Invalid password");
			done();
		})
	});

	after(function(done) {
		AppStorage.resetWallet().then(() => {
			done();
		})
	});

});

describe("Storage Management", function() {

	const item = { obj: { name: "test", age: 100 } };
	const key = "obj";
	let obfuscatekey = "";

	before(function(done) {
		AppStorage.createPassword(masterkey, password)
		.then(() => {
			done();
		})
		.catch((err) => {
			done(err);
		})
	});

	describe("Save an item", function(){

		before(function(done) {
			AppStorage.verifyPassword(masterkey, password)
			.then((result) => {
				obfuscatekey = result;
				done()
			})
			.catch((err) => {
				done(err);
			})
		});
	
		it("Should save an object", function(done) {
			const storage = new AppStorage(obfuscatekey);
			storage.saveItemToStorage(key, item)
			.then(() => {
				done();
			})
			.catch((err) => {
				done(err);
			})
		})

	});

	describe("Load item", function() {

		before(function(done) {
			AppStorage.verifyPassword(masterkey, password)
			.then((result) => {
				obfuscatekey = result;
				done()
			})
			.catch((err) => {
				done(err);
			})
		});
	
		it("Should load an object", function(done) {
			const storage = new AppStorage(obfuscatekey);
			storage.loadItemFromStorage(key)
			.then((result) => {
				expect(result).to.be.an("object");
				expect(result.obj.name).to.be.equal(item.obj.name);
				done();
			})
			.catch((err) => {
				done(err);
			})
		});

		after(function(done) {
			AppStorage.removeItem(key).then(() => {
				done();
			});
		});

	});

	describe("Load removed item", function() {

		before(function(done) {
			AppStorage.verifyPassword(masterkey, password)
			.then((result) => {
				obfuscatekey = result;
				done()
			})
			.catch((err) => {
				done(err);
			})
		});
	
		it("Should throw for load a removed object", function(done) {
			const storage = new AppStorage(obfuscatekey);
			storage.loadItemFromStorage(key)
			.then((result) => {
				expect(result).to.be.equal(null);
				done();
			})
			.catch((err) => {
				done(err);
			});
		});

	})

});
