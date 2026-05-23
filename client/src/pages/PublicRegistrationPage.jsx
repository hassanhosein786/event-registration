import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/Button";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Select from "../components/Select";
import Checkbox from "../components/Checkbox";
import TurnstileWidget from "../components/TurnstileWidget";
import { registrationSchema } from "../utils/validators";
import { genderOptions, campTypeOptions } from "../utils/constants";
import { submitRegistration } from "../services/registrationService";

const initialState = {
  campType: "",
  fullName: "",
  school: "",
  classLevel: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  phone: "",
  email: "",
  parentGuardianName: "",
  parentGuardianRelationship: "",
  parentGuardianContactNumber: "",
  medicalConditions: "",
  guardianInfo: "",
  consentAccepted: false,
  consentRulesAccepted: false,
  emailConfirmationRequested: false,
  date: new Date().toISOString().slice(0, 10),
  honeypot: "",
  turnstileToken: ""
};

const eventName = "Montrose Muslim Association Islamic Summer Camp 2026";

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return "";
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return "";
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return String(age);
};

const PublicRegistrationPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";
  const age = useMemo(() => calculateAge(form.dateOfBirth), [form.dateOfBirth]);

  const derivedPrompt = useMemo(() => eventName, []);

  const onChange = (field) => (e) => {
    const checkboxFields = new Set(["consentAccepted", "consentRulesAccepted", "emailConfirmationRequested"]);
    const value = checkboxFields.has(field) ? e.target.checked : e.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    const result = registrationSchema.safeParse(form);
    if (result.success) {
      setErrors({});
      return true;
    }

    const nextErrors = {};
    for (const issue of result.error.issues) {
      nextErrors[issue.path[0]] = issue.message;
    }
    setErrors(nextErrors);
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.honeypot) {
      toast.error("Submission blocked");
      return;
    }

    if (!validate()) {
      toast.error("Please complete the required fields");
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append("eventId", eventId || "default-event");
    data.append("eventName", eventName);
    if (form.turnstileToken) data.append("turnstileToken", form.turnstileToken);

    setSubmitting(true);
    try {
      const response = await submitRegistration(data);
      toast.success(response.message || "Registration successful");
      navigate("/success", { state: { registration: response.data } });
    } catch (error) {
      const message = error?.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <section className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow">
            <div className="flex flex-col items-center gap-5 text-center">
              <img
                src="/logo.svg"
                alt="Montrose Muslim Association logo"
                className="h-36 w-36 rounded-full bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.18)] ring-1 ring-black/10 sm:h-44 sm:w-44"
              />
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-brand-200">Public Registration Portal</p>
                <h2 className="text-3xl font-semibold text-white">{eventName}</h2>
              </div>
              <div className="rounded-2xl border border-brand-400/20 bg-brand-500/10 px-4 py-3 text-sm text-brand-100">
                {derivedPrompt}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-glow">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-200">Camp Rules and Guidelines</h3>
            <div className="mt-4 space-y-4 text-sm leading-6 text-slate-200">
              <ol className="space-y-2 pl-5">
                <li>
                  <strong>1.</strong> Proper Islamic attire must be worn; i.e., for sisters, only hands, face, and feet can show, while for brothers, long pants and a jersey or shirt are allowed.
                </li>
                <li>
                  <strong>2.</strong> Ameer's instruction should be adhered to at all times.
                </li>
                <li>
                  <strong>3.</strong> Absolutely <strong><u>NO</u></strong> cellular phones allowed. In case of emergency, parents can contact any of the following: 792-0718, 720-3060, 737-2096, 782-9416.
                </li>
                <li>
                  <strong>4.</strong> Absolutely <strong><u>NO</u></strong> valuables such as jewelry, electronic items, large amounts of money, etc. Camp organizers will not be responsible if these items are misplaced.
                </li>
                <li>
                  <strong>5.</strong> No one would be allowed to leave the compound without the Ameer's permission.
                </li>
                <li>
                  <strong>6.</strong> Absolutely <strong><u>NO</u></strong> playing cards, <strong><u>NO SMOKING</u></strong>, <strong><u>VAPING</u></strong>, or illegal activities will be allowed. <strong>Anyone found involved in these acts will be sent home immediately.</strong>
                </li>
                <li>
                  <strong>7.</strong> All other rules and regulations must be obeyed.
                </li>
                <li>
                  <strong>8.</strong> The organizers reserve the right to refuse admission or to suspend any camper who does not comply with the rules of the camp.
                </li>
              </ol>

              <div>
                <p className="font-semibold text-white">
                  Campers <span className="underline decoration-1 underline-offset-2">MUST</span> have the following personal items:
                </p>
                <ol className="mt-2 space-y-2 pl-5">
                  <li><strong>SNEAKERS</strong></li>
                  <li><strong>BED SHEETS</strong></li>
                  <li><strong>THICK BLANKET</strong></li>
                  <li>Pillow</li>
                  <li>Toiletries</li>
                  <li>Towels</li>
                  <li>Sportswear</li>
                  <li>Modest Swimwear</li>
                  <li>Topi for boys</li>
                </ol>
              </div>

              <p>
                A thick blanket and warm sleepwear are necessary as the masjid is fully air conditioned.
              </p>

              <p className="font-semibold underline decoration-1 underline-offset-4">
                There is also a Registration Fee of <strong>$200.00</strong> for campers between the ages of 9 to 19 and a Registration Fee of <strong>$150.00</strong> for campers between the ages of 4 to 8, which must be paid on or by <strong>July 11<sup>th</sup>, 2026</strong>. This is to help cover the costs of resources for classes and outdoor activities, etc.
              </p>

              <p className="text-rose-200">
                Failure to comply with any of the camp rules and guidelines may result in disciplinary action,
                including suspension or immediate dismissal from the camp at the discretion of the organizers.
              </p>

              <p className="font-bold uppercase text-brand-100">
                Visiting hours for parents are from Isha to 10PM.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-glow">
            <Select
              label="Camp type"
              value={form.campType}
              onChange={onChange("campType")}
              error={errors.campType}
              options={campTypeOptions}
              required
            />
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-200">
                Basic Info
              </h3>
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                <Input label="Full name" value={form.fullName} onChange={onChange("fullName")} error={errors.fullName} required />
                <Input label="Date of birth" type="date" value={form.dateOfBirth} onChange={onChange("dateOfBirth")} error={errors.dateOfBirth} required />
                <Input label="Age" value={age} readOnly />
                <Select label="Gender" value={form.gender} onChange={onChange("gender")} error={errors.gender} options={genderOptions} required />
                <Input label="Phone number" value={form.phone} onChange={onChange("phone")} error={errors.phone} required />
                <Input label="Email address" type="email" value={form.email} onChange={onChange("email")} error={errors.email} required />
                <Input label="School" value={form.school} onChange={onChange("school")} error={errors.school} required />
                <Input label="Class level" value={form.classLevel} onChange={onChange("classLevel")} error={errors.classLevel} required />
              </div>
            </div>

            <Textarea label="Address" value={form.address} onChange={onChange("address")} error={errors.address} required />
            <Textarea label="Medical conditions" value={form.medicalConditions} onChange={onChange("medicalConditions")} error={errors.medicalConditions} />
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-200">
                Parent/Guardian Contact
              </h3>
              <div className="mt-4 grid gap-5 md:grid-cols-3">
                <Input
                  label="Name"
                  value={form.parentGuardianName}
                  onChange={onChange("parentGuardianName")}
                  error={errors.parentGuardianName}
                  required
                />
                <Input
                  label="Relationship to camper"
                  value={form.parentGuardianRelationship}
                  onChange={onChange("parentGuardianRelationship")}
                  error={errors.parentGuardianRelationship}
                  required
                />
                <Input
                  label="Contact number"
                  value={form.parentGuardianContactNumber}
                  onChange={onChange("parentGuardianContactNumber")}
                  error={errors.parentGuardianContactNumber}
                  required
                />
              </div>
            </div>
            <Input
              label="Submission date"
              type="date"
              value={form.date}
              onChange={onChange("date")}
              error={errors.date}
            />

            <Checkbox
              label="I consent to the collection and processing of this information."
              checked={form.consentAccepted}
              onChange={onChange("consentAccepted")}
              error={errors.consentAccepted}
            />
            <Checkbox
              label="I consent to the rules and regulations of the camp."
              checked={form.consentRulesAccepted}
              onChange={onChange("consentRulesAccepted")}
              error={errors.consentRulesAccepted}
            />
            <Checkbox
              label="Send me a confirmation email with the completed PDF."
              checked={form.emailConfirmationRequested}
              onChange={onChange("emailConfirmationRequested")}
            />

            <TurnstileWidget
              siteKey={turnstileSiteKey}
              onToken={(token) => setForm((current) => ({ ...current, turnstileToken: token }))}
              onError={(message) => setErrors((current) => ({ ...current, turnstileToken: message }))}
            />

            <div className="hidden">
              <input value={form.honeypot} onChange={onChange("honeypot")} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={submitting} className="min-w-44">
                {submitting ? "Submitting..." : "Submit registration"}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default PublicRegistrationPage;
