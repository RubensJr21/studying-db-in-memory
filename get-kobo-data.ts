process.loadEnvFile();

const env = process.env as {
	UID_ASSET: string;
	KOBO_API_KEY: string;
	VALKEY_PASSWORD: string;
};

if (!env.UID_ASSET) {
	throw new Error(`VALOR UID_ASSET faltando em process.env`);
}

if (!env.KOBO_API_KEY) {
	throw new Error(`VALOR KOBO_API_KEY faltando em process.env`);
}

const fields = [
	"group_DadosBasicos/Txt_IdFamilia",
	"_submission_time",
	"_submitted_by",
	"group_DadosBasicos/Dt_Coleta",
	"group_localizacao/municipio",
	"group_localizacao/geo_Localizacao",
	"group_ProgTransfRenda/bool_CadUnico",
	"group_ProgTransfRenda/dt_CadUnico",
	"group_ProgTransfRenda/integer_PBF",
	"meses_desde_CadUnico_R1",
	"R1",
	"R2",
	"E1",
	"E2",
	"I1",
	"I2",
	"I3",
	"I4",
	"S1",
	"N1",
	"IPM_total",
] as const;

const fields_param = JSON.stringify(fields, null, 0);
const fields_param_encoded = encodeURIComponent(fields_param);

const URL =
	`https://kf.kobotoolbox.org/api/v2/assets/${env.UID_ASSET}/data/?fields=${fields_param_encoded}&sort={"_submission_time": -1}` as const;

const response = await fetch(URL, {
	headers: {
		Authorization: `Token ${env.KOBO_API_KEY}`,
		"Content-Type": "application/json",
	},
	method: "GET",
});

console.log("Status:", response.status, response.statusText);

export async function get_data() {
	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`API Error: ${response.status} - ${errorText}`);
	}
	const data = (await response.json()) as KoboResponse;

	console.log("Total de submissões:", data.count);

	const submissions = data.results; // KoboResults[]
	if (submissions.length > 0) {
		const normalize_mounth_from_last_CadUnico = (value: string) => {
			return Math.max(Number(value), -1);
		};

		const tableData = submissions.slice(0, 5).map((sub) => {
			const date_id = sub._submission_time
        .slice(0, 16)
				.replaceAll(/[-]/g, "")
				.replaceAll(/[T]/g, "C")
				.replaceAll(/[:]/g, "");
      const id = `${sub["group_DadosBasicos/Txt_IdFamilia"]}D${date_id}`.toLocaleLowerCase()
      /*
      console.log(
        id,
        id.length,
        /^[0-9a-fA-F]{24}$/.test(id)
      )
      */
			return {
				// 'submission_id': sub._id,
				id,
				// 'submission_uuid': sub._uuid,
				'family_id': sub['group_DadosBasicos/Txt_IdFamilia'],
				dt_coleta: sub["group_DadosBasicos/Dt_Coleta"],
				municipality: sub["group_localizacao/municipio"],
				localization: sub["group_localizacao/geo_Localizacao"],
				has_CadUnico: sub["group_ProgTransfRenda/bool_CadUnico"],
				dt_CadUnico: sub["group_ProgTransfRenda/dt_CadUnico"] || "Não possui",
				PBF_value: sub["group_ProgTransfRenda/integer_PBF"],
				month_from_last_CadUnico: normalize_mounth_from_last_CadUnico(
					sub["meses_desde_CadUnico_R1"],
				),
				R1: sub.R1,
				R2: sub.R2,
				E1: sub.E1,
				E2: sub.E2,
				I1: sub.I1,
				I2: sub.I2,
				I3: sub.I3,
				I4: sub.I4,
				S1: sub.S1,
				N1: sub.N1,
				total_IPM: sub.IPM_total,
				submission_date: sub._submission_time,
				submited_by: sub._submitted_by,
				// 'validation_status': sub._validation_status
			};
		});

		return tableData;
	}
	return [];
}
