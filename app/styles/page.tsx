"use client";
import { GradientIconButton } from '@/components/library/customButtons/GradientIconButton';
import Heading1 from '@/components/library/customButtons/Heading1';
import Heading2 from '@/components/library/customButtons/Heading2';
import SubHeading from '@/components/library/customButtons/SubHeading';
import Text from '@/components/library/customButtons/Text';
import { BangloreIcon } from '@/components/library/SvgComponents/cityIconComponents/bangloreIcon';
import { ChennaiIcon } from '@/components/library/SvgComponents/cityIconComponents/chennaiIcon';
import { CoimbatoreIcon } from '@/components/library/SvgComponents/cityIconComponents/coimbatoreIcon';
import { DehliIcon } from '@/components/library/SvgComponents/cityIconComponents/dehliIcon';
import { DehradunIcon } from '@/components/library/SvgComponents/cityIconComponents/dehradunIcon';
import { GoaIcon } from '@/components/library/SvgComponents/cityIconComponents/goaIcon';
import { HyderabadIcon } from '@/components/library/SvgComponents/cityIconComponents/hyderabadIcon';
import { JalandarIcon } from '@/components/library/SvgComponents/cityIconComponents/jalandarIcon';
import { KochiIcon } from '@/components/library/SvgComponents/cityIconComponents/kochiIcon';
import { KolkataIcon } from '@/components/library/SvgComponents/cityIconComponents/kolkataIcon';
import { LucknowIcon } from '@/components/library/SvgComponents/cityIconComponents/lucknowIcon';
import { MangloreIcon } from '@/components/library/SvgComponents/cityIconComponents/mangloreIcon';
import { MumbaiIcon } from '@/components/library/SvgComponents/cityIconComponents/mumbaiIcon';
import { MysoreIcon } from '@/components/library/SvgComponents/cityIconComponents/mysoreIcon';
import { NagpurIcon } from '@/components/library/SvgComponents/cityIconComponents/nagpurIcon';
import { PondicherryIcon } from '@/components/library/SvgComponents/cityIconComponents/pondicherryIcon';
import { PuneIcon } from '@/components/library/SvgComponents/cityIconComponents/puneIcon';
import { VadodaraIcon } from '@/components/library/SvgComponents/cityIconComponents/vadodaraIcon';
import { moodMap } from '@/components/search-results/mood-tag';
import { BeachIcon } from '@/components/library/SvgComponents/Icons/beachIcon';
import { CalenderIcon } from '@/components/library/SvgComponents/Icons/calenderIcon';
import { CampingIcon } from '@/components/library/SvgComponents/Icons/campingIcon';
import { CompassIcon } from '@/components/library/SvgComponents/Icons/compassIcon';
import { DesertIcon } from '@/components/library/SvgComponents/Icons/desertIcon';
import { DrinksIcon } from '@/components/library/SvgComponents/Icons/drinksIcon';
import { FastTravelIcon } from '@/components/library/SvgComponents/Icons/fastTravelIcon';
import { FemaleIcon } from '@/components/library/SvgComponents/Icons/femaleIcon';
import { ForestIcon } from '@/components/library/SvgComponents/Icons/forestIcon';
import { GraduationCapIcon } from '@/components/library/SvgComponents/Icons/graduationCapIcon';
import { HealthIcon } from '@/components/library/SvgComponents/Icons/healthIcon';
import { HeritageIcon } from '@/components/library/SvgComponents/Icons/heritageIcon';
import { Hiking1Icon } from '@/components/library/SvgComponents/Icons/hiking1Icon';
import { HikingIcon } from '@/components/library/SvgComponents/Icons/hikingIcon';
import { LandMarkIcon } from '@/components/library/SvgComponents/Icons/landmarkIcon';
import { LearningIcon } from '@/components/library/SvgComponents/Icons/learningIcon';
import { MotorSportsIcon } from '@/components/library/SvgComponents/Icons/motorSportsIcon';
import { MountainIcon } from '@/components/library/SvgComponents/Icons/mountainIcon';
import { NightIcon } from '@/components/library/SvgComponents/Icons/nightIcon';
import { PartiesIcon } from '@/components/library/SvgComponents/Icons/partiesIcon';
import { WellnessIcon } from '@/components/library/SvgComponents/Icons/wellnessIcon';

const StyleGuide = () => {
  return (
    <div className='p-8'>
      <h1 className='font-poppins text-h1 font-semibold mb-8'>
        Component Style Guide
      </h1>
      <section className='mb-12'>
        <h2 className='font-poppins text-h2 font-semibold mb-4'>Typography</h2>
        <div className='space-y-10 p-10'>
          <div className='flex justify-between'>
            <Heading1 fontFamily='poppins'>Poppins H1 | Reg</Heading1>
            <Heading1 fontFamily='barlow'>Barlow H1 | Semibold</Heading1>
          </div>
          <div className='flex justify-between'>
            <Heading2 fontFamily='poppins'>Poppins H2 | Reg</Heading2>
            <Heading2 fontFamily='barlow' style={{ fontStyle: 'italic' }}>
              Barlow Italics H2 | Semibold
            </Heading2>
          </div>
          <div className='flex justify-between'>
            <SubHeading fontFamily='poppins'>
              Poppins | Regular | Line height: 140%
            </SubHeading>
            <SubHeading fontFamily='barlow'>
              Barlow | Medium | Line height: 160%
            </SubHeading>
          </div>
          <div className='flex justify-between'>
            <Text fontFamily='poppins'>Poppins H3 | Regular</Text>
            <Text fontFamily='barlow'>Barlow H3 | Regular </Text>
          </div>
        </div>
      </section>
      <section className='mb-12'>
        <h2 className='font-poppins text-h2 font-semibold mb-4'>Colors</h2>
        <div className='grid grid-cols-2 gap-4'>
          <div className='bg-text-primary p-4 rounded-lg text-white'>
            <p>text-primary</p>
          </div>
          <div className='bg-section-bg p-4 rounded-lg'>
            <p>section-bg</p>
          </div>
          <div className='bg-gradient-heritage p-4 rounded-lg text-white'>
            <p>heritage gradient</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className='font-poppins text-h2 font-semibold mb-4'>Gradients</h2>
        <div className='grid grid-cols-2 md:grid-cols-8 gap-4'>
          {Object.entries(moodMap).map(([name, { bg: Gradient }]: any) => (
            <div key={name} className="flex flex-col items-center">
              {Gradient && <Gradient height='150' width='150' />}
              <span className="mt-2 text-sm font-medium">{name}</span>
            </div>
          ))}
        </div>
        <div className='font-poppins text-h2 font-semibold mt-4 border-t pt-4'>
          Icons
        </div>
        <div className='mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-300 p-6 rounded-lg'>
          <div className='flex flex-col items-center gap-2'>
            <FemaleIcon />
            <div className='font-poppins text-h3 font-semibold'>FemaleIcon</div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <NightIcon />
            <div className='font-poppins text-h3 font-semibold'>NightIcon</div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <CalenderIcon />
            <div className='font-poppins text-h3 font-semibold'>
              CalenderIcon
            </div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <DesertIcon />
            <div className='font-poppins text-h3 font-semibold'>DesertIcon</div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <DrinksIcon />
            <div className='font-poppins text-h3 font-semibold'>DrinksIcon</div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <FastTravelIcon />
            <div className='font-poppins text-h3 font-semibold'>
              FastTravelIcon
            </div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <ForestIcon />
            <div className='font-poppins text-h3 font-semibold'>ForestIcon</div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <HealthIcon />
            <div className='font-poppins text-h3 font-semibold'>HealthIcon</div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <HikingIcon />
            <div className='font-poppins text-h3 font-semibold'>HikingIcon</div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <Hiking1Icon />
            <div className='font-poppins text-h3 font-semibold'>
              Hiking1Icon
            </div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <HeritageIcon />
            <div className='font-poppins text-h3 font-semibold'>
              HeritageIcon
            </div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <LandMarkIcon />
            <div className='font-poppins text-h3 font-semibold'>
              LandMarkIcon
            </div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <LearningIcon />
            <div className='font-poppins text-h3 font-semibold'>
              LearningIcon
            </div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <MountainIcon />
            <div className='font-poppins text-h3 font-semibold'>
              MountainIcon
            </div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <NightIcon />
            <div className='font-poppins text-h3 font-semibold'>NightIcon</div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <BeachIcon />
            <div className='font-poppins text-h3 font-semibold'>BeachIcon</div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <CompassIcon />
            <div className='font-poppins text-h3 font-semibold'>
              CompassIcon
            </div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <HealthIcon />
            <div className='font-poppins text-h3 font-semibold'>HealthIcon</div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <ForestIcon />
            <div className='font-poppins text-h3 font-semibold'>ForestIcon</div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <MotorSportsIcon />
            <div className='font-poppins text-h3 font-semibold'>
              MotorSportsIcon
            </div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <WellnessIcon />
            <div className='font-poppins text-h3 font-semibold'>
              WellnessIcon
            </div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <LearningIcon />
            <div className='font-poppins text-h3 font-semibold'>
              LearningIcon
            </div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <PartiesIcon />
            <div className='font-poppins text-h3 font-semibold'>
              PartiesIcon
            </div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <CampingIcon />
            <div className='font-poppins text-h3 font-semibold'>
              CampingIcon
            </div>
          </div>
        </div>

        <div className='font-poppins text-h2 font-semibold mt-4 border-t pt-4'>
          Buttons
        </div>
        <div className='mt-8 grid grid-cols-2 md:grid-cols-4 gap-4'>
          {Object.entries(moodMap).map(([name, { icon, bg }]: any) => (
            <GradientIconButton
              key={name}
              label={name}
              Icon={icon}
              Gradient={bg}
              onClick={() => { }}
            />
          ))}
        </div>
      </section>

      <section className='mt-12 border-t pt-4 grid gap-4 border-gray-400'>
        <h2 className='font-poppins text-h2 font-semibold mb-4'>CityIcons</h2>
        <div className='grid grid-cols-10 gap-4'>
          <div className='mb-4 flex flex-col items-center'>
            <MumbaiIcon />
            <label className='font-poppins text-h3 font-semibold mt-2'>
              Mumbai
            </label>
          </div>
          <div className='mb-4 flex flex-col items-center'>
            <PuneIcon />
            <label className='font-poppins text-h3 font-semibold mt-2'>
              Pune
            </label>
          </div>
          <div className='mb-4 flex flex-col items-center'>
            <DehliIcon />
            <label className='font-poppins text-h3 font-semibold mt-2'>
              Dehli
            </label>
          </div>
          <div className='mb-4 flex flex-col items-center'>
            <BangloreIcon />
            <label className='font-poppins text-h3 font-semibold mt-2'>
              Banglore
            </label>
          </div>
          <div className='mb-4 flex flex-col items-center'>
            <GoaIcon />
            <label className='font-poppins text-h3 font-semibold mt-2'>
              Goa
            </label>
          </div>
          <div className='mb-4 flex flex-col items-center'>
            <KolkataIcon />
            <label className='font-poppins text-h3 font-semibold mt-2'>
              Kolkata
            </label>
          </div>
          <div className='mb-4 flex flex-col items-center'>
            <ChennaiIcon />
            <label className='font-poppins text-h3 font-semibold mt-2'>
              Chennai
            </label>
          </div>
          <div className='mb-4 flex flex-col items-center'>
            <HyderabadIcon />
            <label className='font-poppins text-h3 font-semibold mt-2'>
              Hyderabad
            </label>
          </div>
          <div className='mb-4 flex flex-col items-center'>
            <KochiIcon />
            <label className='font-poppins text-h3 font-semibold mt-2'>
              Kochi
            </label>
          </div>
          <div className='mb-4 flex flex-col items-center'>
            <DehradunIcon />
            <label className='font-poppins text-h3 font-semibold mt-2'>
              Dehradun
            </label>
          </div>
          <div className='mb-4 flex flex-col items-center'>
            <NagpurIcon />
            <label className='font-poppins text-h3 font-semibold mt-2'>
              Nagpur
            </label>
          </div>
          <div className='mb-4 flex flex-col items-center'>
            <MangloreIcon />
            <label className='font-poppins text-h3 font-semibold mt-2'>
              Manglore
            </label>
          </div>
          <div className='mb-4 flex flex-col items-center'>
            <JalandarIcon />
            <label className='font-poppins text-h3 font-semibold mt-2'>
              Pondicherry
            </label>
          </div>
          <div className='mb-4 flex flex-col items-center'>
            <LucknowIcon />
            <label className='font-poppins text-h3 font-semibold mt-2'>
              Lucknow
            </label>
          </div>
          <div className='mb-4 flex flex-col items-center'>
            <VadodaraIcon />
            <label className='font-poppins text-h3 font-semibold mt-2'>
              Vadodara
            </label>
          </div>
          <div className='mb-4 flex flex-col items-center'>
            <CoimbatoreIcon />
            <label className='font-poppins text-h3 font-semibold mt-2'>
              Coimbatore
            </label>
          </div>
          <div className='mb-4 flex flex-col items-center'>
            <KolkataIcon />
            <label className='font-poppins text-h3 font-semibold mt-2'>
              Kolkata
            </label>
          </div>
          <div className='mb-4 flex flex-col items-center'>
            <MysoreIcon />
            <label className='font-poppins text-h3 font-semibold mt-2'>
              Mysore
            </label>
          </div>
          <div className='mb-4 flex flex-col items-center'>
            <PondicherryIcon />
            <label className='font-poppins text-h3 font-semibold mt-2'>
              Pondicherry
            </label>
          </div>
        </div>
      </section>
    </div>
  );
};
export default StyleGuide;
