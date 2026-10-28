import Link from 'next/link';
import { Brand } from '@/components/brand';

export const metadata = {
  title: 'Customer Dumpster Rental Terms & Conditions',
  description: 'Standard dumpster rental terms, property access, weight allowances, prohibited materials, and damage waivers.',
  robots: { index: false, follow: false },
};

export default function Terms() {
  return (
    <main className="terms-page">
      <div style={{ background: '#23392b', padding: '20px 0', borderRadius: 10 }}>
        <Brand />
      </div>

      <h1>Dumpster Rental Agreement & Customer Terms</h1>
      <p>
        These Customer Rental Terms and Conditions govern the reservation, drop-off, placement, use,
        and pickup of roll-off dumpster containers provided by the independent hauling operator
        (&ldquo;Hauler&rdquo;) to the customer (&ldquo;Customer&rdquo;) via the RollOS booking platform.
        By placing a booking, submitting payment, or electronically signing the rental agreement, Customer
        agrees to be legally bound by these terms.
      </p>

      <h2>1. Rental Period & Extensions</h2>
      <p>
        The base rental duration begins upon delivery of the container and continues for the scheduled
        number of days specified in your checkout summary (typically 7 calendar days unless otherwise agreed).
        If Customer requires the dumpster beyond the agreed rental period, Customer must notify Hauler at least
        24 hours prior to the scheduled pickup date. Additional days will be billed automatically to the credit card
        on file at the daily extension rate displayed during booking.
      </p>

      <h2>2. Delivery, Placement & Property Access</h2>
      <p>
        Customer warrants that they own the delivery premises or have full legal authority to grant Hauler access.
        Customer is responsible for designating an unobstructed, structurally sound, level surface for container placement
        (typically a paved driveway, compacted gravel pad, or private parking space).
      </p>
      <p>
        The placement site must maintain a minimum overhead vertical clearance of 14 feet free of low-hanging tree branches,
        overhead utility lines, carports, and roof eaves, and a minimum horizontal clearance of 10 feet. If placement is
        requested on a public street, alleyway, sidewalk, or municipal right-of-way, Customer is solely responsible for
        securing all necessary city permits, street obstruction licenses, and safety cones prior to delivery.
      </p>

      <h2>3. Driveway & Property Damage Waiver</h2>
      <p>
        Roll-off collection trucks and loaded steel dumpsters exert significant weight—frequently exceeding 30,000 to
        60,000 pounds gross vehicular weight. Customer acknowledges that Hauler shall not be liable for any damage to
        driveways, pavement, asphalt, pavers, concrete slabs, curbs, lawns, irrigation systems, underground pipes, septic tanks,
        or utilities resulting from the delivery, placement, or removal of the container at Customer&rsquo;s directed location.
      </p>
      <p>
        Hauler recommends that Customer place protective 2&times;8 or 2&times;10 wooden boards along the planned placement area
        to cushion contact rollers and distribute container weight.
      </p>

      <h2>4. Permitted Debris & Safe Loading Limits</h2>
      <p>
        Dumpsters may be used exclusively for standard non-hazardous municipal solid waste, construction and demolition debris,
        household clutter, furniture, framing lumber, drywall, and yard trimmings.
      </p>
      <p>
        All debris must be loaded uniformly and must not exceed the top water-level rim of the container. No materials may extend
        above the top rails or hang over the sides. Under state and federal Department of Transportation (DOT) safety regulations,
        drivers cannot lawfully haul uncovered or overloaded containers on public roadways. If a container is overloaded,
        Customer will be required to level off excess debris before pickup.
      </p>

      <h2>5. Strictly Prohibited Materials & Hazardous Waste</h2>
      <p>
        Under no circumstances may Customer dispose of hazardous, toxic, flammable, or environmentally regulated materials in the
        container. Strictly prohibited items include, without limitation:
      </p>
      <ul style={{ margin: '10px 0 16px 24px', lineHeight: 1.8, fontSize: '13.5px', color: '#4d5746' }}>
        <li>Wet paint, solvents, chemical cleansers, motor oils, fuels, and hazardous liquids</li>
        <li>Automotive batteries and lithium-ion batteries</li>
        <li>Tires and rubber tracks (landfill bans apply)</li>
        <li>Refrigerators, freezers, air conditioners, and any appliances containing Freon or refrigerants</li>
        <li>Propane tanks, pressurized gas cylinders, and sealed drums</li>
        <li>Asbestos, medical waste, biological materials, and radioactive substances</li>
        <li>Dense inert materials (concrete, dirt, rock, sod, brick) in boxes larger than 10 yards</li>
      </ul>
      <p>
        Introduction of prohibited materials will result in immediate rejection at disposal facilities, hazardous material
        remediation surcharges, and municipal contamination penalties billed directly to Customer.
      </p>

      <h2>6. Weight Allowances & Certified Scale Overage Billing</h2>
      <p>
        Your rental includes a pre-paid disposal weight allowance specified during checkout (e.g., 2.0 tons for a 20-yard dumpster).
        Following container pickup, Hauler transports the box to a licensed state-certified landfill or transfer station where the truck
        and container are weighed on certified vehicle scales.
      </p>
      <p>
        If the net weight exceeds the included tonnage allowance, Customer authorizes Hauler to bill the excess weight to the credit card
        on file at the agreed per-ton overage rate displayed at booking. Hauler attaches the official landfill weight ticket to your final invoice
        as indisputable proof of disposal weight.
      </p>

      <h2>7. Blocked Access & Trip Charges</h2>
      <p>
        If Hauler&rsquo;s driver arrives to deliver or retrieve a container and access is blocked by parked vehicles, locked security gates,
        low utility lines, ice/snow hazards, or an improperly loaded box, a dry-run trip charge will be assessed to offset driver time
        and fuel expenses.
      </p>

      <h2>8. Cancellations & Rescheduling</h2>
      <p>
        Customer may cancel or reschedule a booking with a full refund by contacting Hauler at least 24 hours prior to the scheduled
        delivery date. Cancellations requested on the day of delivery after the driver has dispatched or loaded the container may be subject
        to a standard dispatch cancellation fee.
      </p>

      <h2>9. Electronic Signature & Payment Authorization</h2>
      <p>
        By providing credit card details and typing an electronic signature during checkout, Customer authorizes Hauler to process the initial
        rental payment and any subsequent legitimate post-rental charges (overage tonnage, extra rental days, dry-run fees, or contamination fines).
        Customer&rsquo;s electronic signature, IP address, and timestamp are securely retained as a binding audit trail in accordance with the
        federal Electronic Signatures in Global and National Commerce (ESIGN) Act.
      </p>

      <Link href="/" className="btn">
        Return to RollOS Dumpster Rental Software
      </Link>
    </main>
  );
}
