import {
  Collection,
  Db,
  MongoClient,
  ObjectId,
  type Document
} from "mongodb";
import { get_data } from "./get-kobo-data.ts";

class KoboToolboxCRUD {
	private uri: string;
	private client;
	private db: Db | null;
	public collection: Collection<Document> | null;
	constructor() {
		const username = "root";
		const password = "example";
		this.uri = `mongodb://${username}:${password}@localhost:27017/`;
		this.client = new MongoClient(this.uri, {
			// serverApi: { version: ServerApiVersion.v1, strict: true },
		});
		this.db = null;
		this.collection = null;
	}

	async connect() {
		try {
			console.log("🔌 Conectando MongoDB...");
			await this.client.connect();
			this.db = this.client.db("kobotoolbox_cache");
			this.collection = this.db.collection("forms");
			console.log("✅ Conectado MongoDB");
		} catch (error) {
			console.error("❌ Erro conexão:", error);
			process.exit(1);
		}
	}

	async limpar() {
		console.log("🗑️ Limpando coleção...");
		const result = await this.collection?.deleteMany({});
		console.log(`✅ ${result?.deletedCount} documentos removidos`);
	}

	async run() {
		try {
			await this.connect();
			await this.limpar();

			const data = await get_data();

			// console.table(data)

			if (data.length > 0) {
				await this.collection?.insertMany(
					data.map(({ id, ...rest }) => ({
						_id: new ObjectId(id),
						...rest,
					})),
				);

				const registros = await this.collection?.distinct("_id");
				console.log("IDs salvos:", registros);

				// Filtros Kobotoolbox reais
				const cadUnico = await this.collection?.countDocuments({
					has_CadUnico: "S",
				});
				console.log("Famílias CadÚnico:", cadUnico);
			}
		} catch (error) {
			console.error("❌ Erro geral:", error);
		} finally {
			await this.client.close();
			console.log("🔌 MongoDB desconectado");
		}
	}
}

const kt = new KoboToolboxCRUD();
kt.run().catch(console.dir);
