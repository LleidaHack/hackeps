import React from "react";
import FAQContainer from "src/components/hackeps/FAQ_container/FAQ_container.js";
import DarkPage from "src/components/hackeps/Layout/DarkPage.js";

const faqContent = [
  {
    question: "Què és la HackEPS?",
    blocks: [
      "La HackEPS és una hackató universitària de 24 hores intensives organitzada per LleidaHack juntament amb l'Escola Politècnica Superior de la Universitat de Lleida (UdL). Durant el cap de setmana del 28 i 29 de novembre, els participants formen equips i desenvolupen prototips tecnològics per resoldre reptes reals proposats per empreses i institucions col·laboradores.",
    ],
  },
  {
    question: "Qui hi pot participar?",
    blocks: [
      "Està dirigida principalment a estudiants universitaris, de cicles formatius i joves acabats de graduar interessats en programació, disseny, negoci, comunicació, maquinari o qualsevol àmbit tecnològic. No cal ser un expert: el requisit fonamental és tenir motivació per aprendre, crear i treballar en equip.",
    ],
  },
  {
    question: "Com funcionen els equips?",
    blocks: [
      "Els equips estan formats per un màxim de 3 a 4 persones. Pots inscriure't amb el teu equip ja tancat o de manera individual; en aquest darrer cas, l'organització facilita dinàmiques a l'inici per ajudar-te a trobar companys.",
    ],
  },
  {
    question: "On se celebra?",
    blocks: [
      "A les instal·lacions de l'Escola Politècnica Superior (EPS, UdL), al Campus de Cappont de Lleida. Les cerimònies d'obertura i cloenda tindran lloc a l'Auditori de l'Edifici Jaume Porta.",
    ],
  },
  {
    question: "Com i quan es recullen les acreditacions?",
    blocks: [
      "Les acreditacions es lliuraran el dissabte 28 de novembre a partir de les 08:30 h al hall d'entrada principal de l'EPS. Allà rebràs la teva identificació oficial, les instruccions inicials i la bossa de benvinguda.",
    ],
  },
  {
    question: "Com comença i quan acaba la hackató?",
    blocks: [
      "Dissabte 28: La cerimònia d'obertura començarà a les 10:00 h a l'Auditori Jaume Porta per presentar les normes i els reptes de les empreses. El compte enrere de programació de 24 hores s'iniciarà just en finalitzar la cerimònia (cap a les 11:00 h).",
      "Diumenge 29: El període de programació finalitzarà a les 11:00 h. A les 11:30 h s'iniciarà l'avaluació dels projectes davant dels jurats i a les 14:00 h se celebrarà la cerimònia de cloenda i l'entrega de premis.",
    ],
  },
  {
    question: "Què he de portar?",
    blocks: [
      [
        "Ordinador portàtil i carregador.",
        "Document d'identitat (DNI, NIE o passaport) i/o carnet d'estudiant.",
        "Auriculars, adaptadors i cables necessaris.",
        "Roba còmoda per a 24 hores.",
        "Maquinari addicional si el teu projecte ho requereix (plaques, sensors, microcontroladors).",
        "Material de descans (sac de dormir, màrfega o coixí) si vols utilitzar l'aula de descans habilitada per la nit.",
      ],
      "Recomanació: lladre de corrent (regleta), bateria externa i ampolla d'aigua reutilitzable.",
    ],
  },
  {
    question: "Hi haurà connexió a internet?",
    blocks: [
      "Sí. Tots els assistents disposaran de connexió Wi-Fi d'alta velocitat durant tot l'esdeveniment facilitada a l'arribada.",
    ],
  },
  {
    question: "S'ofereix menjar i beguda?",
    blocks: [
      "Sí. Tots els àpats estan coberts per l'organització sense cap cost:",
      [
        "Esmorzar de dissabte i diumenge (de 08:30 h a 12:00 h).",
        "Dinar de dissabte (servei de càtering).",
        "Sopar de dissabte a la nit (pizzes).",
        "Dinar de diumenge (entrepans).",
        "Aperitius i begudes disponibles continuadament a la zona d'avituallament.",
      ],
      "Nota: Si tens al·lèrgies o intoleràncies alimentàries, assegura't d'haver-ho notificat en el formulari d'inscripció. Queda totalment prohibida l'entrada d'alcohol o substàncies il·legals al recinte.",
    ],
  },
  {
    question: "Hi haurà activitats paral·leles?",
    blocks: [
      "Sí. A banda de programar, l'organització programa dinàmiques de descans, reptes ràpids i activitats perquè pugueu desconnectar, moure-us una estona i fer networking amb altres equips i empreses.",
    ],
  },
  {
    question: "Com s'avaluen els projectes?",
    blocks: [
      "Diumenge a les 11:30 h, els equips defensaran la seva proposta directament davant del jurat d'empreses corresponent a les aules assignades. A més, els projectes s'hauran de pujar prèviament a la plataforma Devpost. Els criteris d'avaluació principals inclouen:",
      [
        "Innovació i originalitat de la idea.",
        "Dificultat i qualitat tècnica de la solució.",
        "Viabilitat i aplicació pràctica al món real.",
        "Qualitat de la presentació i funcionament de la demo en directe.",
      ],
    ],
  },
  {
    question: "Quins premis hi ha?",
    blocks: [
      "Cada empresa col·laboradora atorga un premi específic al millor projecte que hagi resolt el seu repte. Els guardons inclouen premis econòmics en metàl·lic, maquinari, dispositius tecnològics, llicències de programari o oportunitats laborals.",
    ],
  },
  {
    question: "Qui és el titular de la propietat intel·lectual dels projectes?",
    blocks: [
      "La propietat intel·lectual del codi i dels dissenys desenvolupats durant el cap de setmana pertany íntegrament als participants dels equips creadors.",
    ],
  },
  {
    question: "Hi haurà mentors i suport tècnic durant l'esdeveniment?",
    blocks: [
      "Sí. Durant les 24 hores hi haurà voluntaris de LleidaHack per resoldre qualsevol dubte logístic, així com mentors tècnics i representants de les empreses que podran orientar-vos amb l'enfocament del repte.",
    ],
  },
  {
    question: "Existeix un codi de conducta?",
    blocks: [
      "Sí. La HackEPS es regeix per un codi de conducta estricte basat en el respecte mutu, la col·laboració i la tolerància zero envers qualsevol tipus d'assetjament, discriminació o comportament inadequat.",
    ],
  },
  {
    question: "Com em puc inscriure i on puc consultar dubtes?",
    blocks: [
      "Les inscripcions es gestionen directament des del web oficial de HackEPS i la plataforma Devpost. Per a consultes organitzatives, pots escriure a contacte@lleidahack.dev o contactar amb nosaltres a través de les nostres xarxes socials.",
    ],
  },
];

const faqs = faqContent.map(({ question, blocks }) => ({
  question,
  answer: (
    <div className="space-y-4">
      {blocks.map((block, index) =>
        Array.isArray(block) ? (
          <ul key={index} className="m-0 list-disc space-y-2 pl-5">
            {block.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p key={index} className="m-0">
            {block}
          </p>
        ),
      )}
    </div>
  ),
}));

const FAQPage = () => (
  <DarkPage>
    <FAQContainer faqs={faqs} />
  </DarkPage>
);

export default FAQPage;
